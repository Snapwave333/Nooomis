Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[INFO] $msg" }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }

$workspace = "c:\Users\chrom\OneDrive\Desktop\apps\games\simon"
$webSrc = Join-Path $workspace 'web-react\dist'
if (-not (Test-Path $webSrc)) { throw "React build folder not found at $webSrc" }

Write-Info "Checking tooling (Node, npm, Java)..."
try { node -v | Out-Null } catch { throw "Node.js not found. Install Node first." }
try { npm -v | Out-Null } catch { throw "npm not found. Install Node/npm first." }
if (-not (Get-Command java -ErrorAction SilentlyContinue)) { throw "Java JDK not found. Install JDK 11+." }
$javaExe = (Get-Command java).Source
$javaBin = [System.IO.Path]::GetDirectoryName($javaExe)
$env:JAVA_HOME = [System.IO.Path]::GetDirectoryName($javaBin)
$env:CORDOVA_TELEMETRY = 'off'
$env:CI = 'true'
# Allow fast relaunch without rebuilding when APK already exists
$fastRelaunch = $env:NOMIS_FAST_RELAUNCH -eq '1'
$pushedTemp = $false
$pushedProj = $false

function Find-ExistingApk {
  $pattern = Join-Path $env:TEMP 'nomis-cordova*'
  $candidates = Get-ChildItem -Path $pattern -Directory -ErrorAction SilentlyContinue
  $found = @()
  foreach ($dir in $candidates) {
    try {
      $apk = Get-ChildItem -Path (Join-Path $dir.FullName 'platforms\android\app\build\outputs\apk\debug') -Filter 'app-debug.apk' -File -ErrorAction SilentlyContinue
      if ($apk) {
        $found += [PSCustomObject]@{ ApkPath = $apk.FullName; ProjDir = $dir.FullName; MTime = $apk.LastWriteTimeUtc }
      }
    } catch {}
  }
  if ($found.Count -gt 0) { return ($found | Sort-Object -Property MTime -Descending | Select-Object -First 1) }
  return $null
}

$sdkRoot = Join-Path $env:LOCALAPPDATA 'Android\sdk'
$cmdlineRoot = Join-Path $sdkRoot 'cmdline-tools'
$cmdlineLatest = Join-Path $cmdlineRoot 'latest'
New-Item -ItemType Directory -Force -Path $sdkRoot | Out-Null

function Ensure-AndroidCmdlineTools {
  if ((Test-Path (Join-Path $cmdlineLatest 'bin\sdkmanager.bat'))) {
    Write-Info "Android cmdline-tools already present."
    return
  }
  Write-Info "Downloading Android Commandline Tools..."
  $zipUrl = 'https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip'
  $zipPath = Join-Path $env:TEMP 'cmdline-tools.zip'
  Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath
  Write-Info "Extracting cmdline-tools..."
  $extractDir = Join-Path $env:TEMP 'cmdline-tools-extract'
  if (Test-Path $extractDir) { Remove-Item -Recurse -Force $extractDir }
  Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force
  New-Item -ItemType Directory -Force -Path $cmdlineLatest | Out-Null
  # Move extracted 'cmdline-tools' contents into latest/
  Get-ChildItem -Path (Join-Path $extractDir 'cmdline-tools') | ForEach-Object {
    Move-Item -Force -Path $_.FullName -Destination $cmdlineLatest
  }
}

Ensure-AndroidCmdlineTools

$env:ANDROID_SDK_ROOT = $sdkRoot
$env:ANDROID_HOME = $sdkRoot
$sdkmgr = Join-Path $cmdlineLatest 'bin\sdkmanager.bat'
$avdmgr = Join-Path $cmdlineLatest 'bin\avdmanager.bat'
$emu = Join-Path $sdkRoot 'emulator\emulator.exe'
$adb = Join-Path $sdkRoot 'platform-tools\adb.exe'

Write-Info "Installing SDK components (platform-tools, emulator, platforms, build-tools, system images)..."

function Accept-Licenses {
  Write-Info "Accepting SDK licenses..."
  cmd /c "for /L %i in (1,1,200) do echo y" | & $sdkmgr --licenses --sdk_root=$sdkRoot | Out-Null
}

& $sdkmgr --sdk_root=$sdkRoot 'platform-tools' 'emulator' 'platforms;android-35' 'build-tools;35.0.0' 'system-images;android-34;google_apis;x86_64'
Accept-Licenses

Write-Info "Ensuring AVD exists..."
$avdName = 'NOMIS_API34'
if (-not (Test-Path (Join-Path "$env:USERPROFILE\.android\avd" "$avdName.avd"))) {
  & $avdmgr create avd -n $avdName -k 'system-images;android-34;google_apis;x86_64' --force | Write-Host
}

Write-Info "Preparing Cordova project..."
$projDir = Join-Path $env:TEMP 'nomis-cordova'
$apkDebugPath = Join-Path $projDir 'platforms\android\app\build\outputs\apk\debug\app-debug.apk'
$apkReleasePath = Join-Path $projDir 'platforms\android\app\build\outputs\apk\release\app-release.apk'
$aabReleasePath = Join-Path $projDir 'platforms\android\app\build\outputs\bundle\release\app-release.aab'
$distDir = Join-Path $workspace 'dist\android'
$releaseRequested = ($env:NOMIS_RELEASE -eq '1')
$needBuild = $true
if ($fastRelaunch -and (Test-Path $apkDebugPath)) {
  Write-Info "Fast relaunch requested and existing APK found. Skipping rebuild."
  $needBuild = $false
}
elseif ($fastRelaunch) {
  $existing = Find-ExistingApk
  if ($existing -ne $null) {
    $projDir = $existing.ProjDir
    $apkDebugPath = $existing.ApkPath
    Write-Info "Fast relaunch found APK at $apkPath"
    $needBuild = $false
  }
}
if ($needBuild) {
  Write-Info "Scaffolding Cordova app..."
  if (Test-Path $projDir) {
    Write-Info "Cleaning previous Cordova project directory..."
    try { Remove-Item -Recurse -Force -ErrorAction Stop $projDir }
    catch {
      Write-Warn "Failed to delete $projDir cleanly. Using a fresh temp directory."
      $projDir = Join-Path $env:TEMP ("nomis-cordova-" + [Guid]::NewGuid().ToString("N").Substring(8))
      $apkPath = Join-Path $projDir 'platforms\android\app\build\outputs\apk\debug\app-debug.apk'
    }
  }
  Push-Location $env:TEMP
  $pushedTemp = $true
  $projName = Split-Path -Leaf $projDir
  npx --yes cordova@latest create $projName com.nomis.simon NOMIS
  Push-Location $projDir
  $pushedProj = $true
  npx --yes cordova@latest platform add android@latest
  # Pin Android Gradle Plugin and Gradle wrapper for Studio compatibility
  Write-Info "Pinning Android Gradle Plugin to 8.1.2 and Gradle to 8.1..."
  $topBuild = Join-Path $projDir 'platforms\android\build.gradle'
  $settingsBuild = Join-Path $projDir 'platforms\android\app\build.gradle'
  $wrapperProps = Join-Path $projDir 'platforms\android\gradle\wrapper\gradle-wrapper.properties'
  $gradleProps = Join-Path $projDir 'platforms\android\gradle.properties'
  if (Test-Path $topBuild) {
    $tb = Get-Content $topBuild -Raw
    $tb = $tb -replace "classpath\s+['\`"]com\.android\.tools\.build:gradle:[^'\`"]+['\`"]", "classpath 'com.android.tools.build:gradle:8.1.2'"
    Set-Content $topBuild $tb
  }
  if (Test-Path $settingsBuild) {
    (Get-Content $settingsBuild) -replace 'compileSdkVersion\s+\d+', 'compileSdkVersion 35' | Set-Content $settingsBuild
  }
  if (Test-Path $wrapperProps) {
    (Get-Content $wrapperProps) -replace 'distributionUrl=.*', 'distributionUrl=https\://services.gradle.org/distributions/gradle-8.1-bin.zip' | Set-Content $wrapperProps
  }
  # Suppress AGP warning for compileSdk 35 with AGP 8.1.2
  $suppression = 'android.suppressUnsupportedCompileSdk=35'
  if (Test-Path $gradleProps) {
    $gp = Get-Content $gradleProps -Raw
    if ($gp -notmatch [regex]::Escape($suppression)) {
      # Ensure we append with a newline to avoid concatenating onto the previous property
      $needsNl = ($gp -notmatch "(`r`n|\n)$")
      if ($needsNl) { $toAppend = "`r`n" + $suppression + "`r`n" } else { $toAppend = $suppression + "`r`n" }
      Add-Content -Path $gradleProps -Value $toAppend
    }
    # Sanitize any literal backtick-newline sequences accidentally introduced by prior runs
    $gpFixed = Get-Content $gradleProps -Raw
    $gpFixed = $gpFixed -replace '`r`n', "`r`n"
    # Normalize AndroidX/Jetifier booleans to plain true/false (no quoting)
    $lines = $gpFixed -split "(`r`n|\n)"
    $norm = foreach ($line in $lines) {
      if ($line -match '^\s*android\.enableJetifier\s*=') { 'android.enableJetifier=true' }
      elseif ($line -match '^\s*android\.useAndroidX\s*=') { 'android.useAndroidX=true' }
      else { $line }
    }
    $gpFixed = ($norm -join "`r`n")
    if ($gpFixed -notmatch "(`r`n|\n)$") { $gpFixed += "`r`n" }
    Set-Content -Path $gradleProps -Value $gpFixed
  } else {
    # Create gradle.properties with proper newline termination
    Set-Content -Path $gradleProps -Value ($suppression + "`r`n")
  }

  # Ensure signing keystore for release builds
  function Ensure-UploadKeystore {
    $keystoreDir = Join-Path $env:USERPROFILE '.nomis'
    $keystorePath = Join-Path $keystoreDir 'upload.keystore'
    New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null
    if (-not (Test-Path $keystorePath)) {
      Write-Info "Generating upload keystore..."
      $storePass = $env:NOMIS_KEYSTORE_PASS; if (-not $storePass) { $storePass = 'nomis_upload' }
      $alias = $env:NOMIS_KEY_ALIAS; if (-not $alias) { $alias = 'upload' }
      $keyPass = $env:NOMIS_KEY_PASS; if (-not $keyPass) { $keyPass = $storePass }
      $dname = $env:NOMIS_KEY_DNAME; if (-not $dname) { $dname = 'CN=Nomis,O=Nomis,L=Nomis,ST=Nomis,C=US' }
      & keytool -genkeypair -v -keystore $keystorePath -storepass $storePass -keypass $keyPass -alias $alias -keyalg RSA -keysize 2048 -validity 3650 -dname $dname | Out-Null
    }
    return $keystorePath
  }

  $keystorePath = Ensure-UploadKeystore
  $storePass = $env:NOMIS_KEYSTORE_PASS; if (-not $storePass) { $storePass = 'nomis_upload' }
  $alias = $env:NOMIS_KEY_ALIAS; if (-not $alias) { $alias = 'upload' }
  $keyPass = $env:NOMIS_KEY_PASS; if (-not $keyPass) { $keyPass = $storePass }
  $buildCfg = Join-Path $projDir 'build.json'
  $buildJson = @{
    android = @{ release = @{ keystore = $keystorePath; storePassword = $storePass; alias = $alias; password = $keyPass; keystoreType = '' } }
  } | ConvertTo-Json -Depth 4
  Set-Content -Path $buildCfg -Value $buildJson -Encoding UTF8

  Write-Info "Copying web assets into Cordova www/ ..."
  $www = Join-Path $projDir 'www'
  if (Test-Path $www) { Remove-Item -Recurse -Force $www }
  New-Item -ItemType Directory -Force -Path $www | Out-Null
  
  # Set React app as the entry point
  Write-Info "Setting React app as entry point..."
  $configXml = Join-Path $projDir 'config.xml'
  if (Test-Path $configXml) {
    $configContent = Get-Content $configXml -Raw
    $configContent = $configContent -replace '<content src="index\.html" />', '<content src="index.html" />'
    Set-Content $configXml $configContent
    Write-Info "Updated config.xml to use React app as entry point"
  } else {
    Write-Warning "config.xml not found at $configXml"
  }
  # Use simple recursive copy
  Copy-Item -Path "$webSrc\*" -Destination $www -Recurse -Force

Write-Info "Building Android artifacts..."
# Install Gradle only if neither wrapper nor local Gradle is available
function Ensure-Gradle {
  # Ensure a system Gradle for Cordova to generate wrapper if needed
  if (Get-Command gradle -ErrorAction SilentlyContinue) {
    Write-Info "System Gradle detected; using existing installation."
    return
  }
  $gradleVersion = '8.13'
  $gradleZip = "https://services.gradle.org/distributions/gradle-$gradleVersion-bin.zip"
  $zipPath = Join-Path $env:TEMP "gradle-$gradleVersion-bin.zip"
  $gradleRoot = Join-Path $env:LOCALAPPDATA 'gradle'
  $gradleHome = Join-Path $gradleRoot "gradle-$gradleVersion"
  $gradleBat = Join-Path $gradleHome 'bin\gradle.bat'
  if (-not (Test-Path $gradleBat)) {
    Write-Info "Installing Gradle $gradleVersion..."
    New-Item -ItemType Directory -Force -Path $gradleRoot | Out-Null
    Invoke-WebRequest -Uri $gradleZip -OutFile $zipPath
    if (-not (Test-Path $gradleHome)) {
      Expand-Archive -Path $zipPath -DestinationPath $gradleRoot
    }
  }
  $env:Path = "$gradleHome\bin;$env:Path"
}
  Ensure-Gradle
  if ($releaseRequested) {
    Write-Info "Building signed release APK..."
    npx --yes cordova@latest build android --release --buildConfig=$buildCfg
    if (-not (Test-Path $apkReleasePath)) { Write-Warn "Release APK not found at $apkReleasePath" } else { Write-Info "Release APK: $apkReleasePath" }
    Write-Info "Building Play-ready AAB bundle..."
    npx --yes cordova@latest build android --release -- --packageType=bundle --buildConfig=$buildCfg
    if (-not (Test-Path $aabReleasePath)) { Write-Warn "Release AAB not found at $aabReleasePath" } else { Write-Info "Release AAB: $aabReleasePath" }
    New-Item -ItemType Directory -Force -Path $distDir | Out-Null
    if (Test-Path $apkReleasePath) { Copy-Item -Force $apkReleasePath (Join-Path $distDir 'app-release.apk') }
    if (Test-Path $aabReleasePath) { Copy-Item -Force $aabReleasePath (Join-Path $distDir 'app-release.aab') }
  } else {
    Write-Info "Building debug APK..."
    npx --yes cordova@latest build android --debug
    if (-not (Test-Path $apkDebugPath)) { throw "APK not found at $apkDebugPath" }
    Write-Info "APK built: $apkDebugPath"
  }
} else {
  # Ensure we are in project directory for any relative operations
  if (Test-Path $projDir) { Push-Location $projDir; $pushedProj = $true }
}

Write-Info "Starting emulator..."
Start-Process -FilePath $emu -ArgumentList "-avd $avdName -netdelay none -netspeed full" -WindowStyle Minimized

Write-Info "Waiting for emulator to be ready..."
for ($i=0; $i -lt 120; $i++) {
  Start-Sleep -Seconds 3
  try {
    $out = & $adb devices
    if ($out -match "\tdevice\s*$" -and -not ($out -match 'offline')) {
      $boot = & $adb shell getprop sys.boot_completed
      if ($boot -match '1') { break }
    }
  } catch {}
}

Write-Info "Uninstalling previous app (if any)..."
try { & $adb uninstall com.nomis.simon | Out-Null } catch {}
Write-Info "Installing APK to emulator..."
$apkToInstall = $apkDebugPath
if ($releaseRequested -and (Test-Path $apkReleasePath)) { $apkToInstall = $apkReleasePath }
& $adb install -r $apkToInstall | Write-Host
& $adb install -r $apkToInstall

Write-Info "Launching app..."
& $adb shell monkey -p com.nomis.simon -c android.intent.category.LAUNCHER 1 | Out-Null

if ($pushedProj) { Pop-Location }
if ($pushedTemp) { Pop-Location }
Write-Host "Done. Emulator should be running NOMIS." -ForegroundColor Cyan