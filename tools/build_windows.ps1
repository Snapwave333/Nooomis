# Build Windows executable for NOMIS
param(
    [string]$OutputDir = "dist\windows"
)

Write-Host "Building Windows executable for NOMIS..." -ForegroundColor Green

# Create output directory
if (Test-Path $OutputDir) { Remove-Item -Recurse -Force $OutputDir }
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

# Copy React build assets
Write-Host "Copying React build assets..." -ForegroundColor Yellow
$reactBuildSrc = "web-react\dist"
$wwwDir = Join-Path $OutputDir "www"
New-Item -ItemType Directory -Force -Path $wwwDir | Out-Null

# Use simple recursive copy
Copy-Item -Path "$reactBuildSrc\*" -Destination $wwwDir -Recurse -Force

# Create Electron wrapper
Write-Host "Creating Electron wrapper..." -ForegroundColor Yellow
$electronDir = Join-Path $OutputDir "electron"
New-Item -ItemType Directory -Force -Path $electronDir | Out-Null

# Create package.json for Electron
$packageJson = @{
    name = "nomis"
    version = "2.0.0"
    description = "NOOOMIS - Digital Simon Says Game"
    main = "main.js"
    scripts = @{
        start = "electron ."
        build = "electron-builder"
    }
    build = @{
        appId = "com.nomis.simon"
        productName = "NOOOMIS"
        directories = @{
            output = "dist"
        }
        files = @(
            "main.js",
            "preload.js",
            "www/**/*"
        )
        win = @{
            target = "nsis"
            icon = "assets/icon.ico"
        }
        nsis = @{
            oneClick = $false
            allowToChangeInstallationDirectory = $true
        }
    }
} | ConvertTo-Json -Depth 10

Set-Content -Path (Join-Path $electronDir "package.json") -Value $packageJson -Encoding UTF8

# Create main.js for Electron
$mainJs = @'
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        title: 'NOOOMIS - Digital Simon Says Game',
        show: false
    });

    // Load the React app
    mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create menu
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Game',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        mainWindow.loadFile(path.join(__dirname, 'www', 'index.html'));
                    }
                },
                {
                    label: 'Welcome Screen',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        mainWindow.loadFile(path.join(__dirname, 'www', 'welcome.html'));
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
'@

Set-Content -Path (Join-Path $electronDir "main.js") -Value $mainJs -Encoding UTF8

# Create preload.js
$preloadJs = @'
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    versions: process.versions
});
'@

Set-Content -Path (Join-Path $electronDir "preload.js") -Value $preloadJs -Encoding UTF8

# Create assets directory and copy icon
$assetsDir = Join-Path $electronDir "assets"
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null

# Create a simple icon (placeholder)
$iconPath = Join-Path $assetsDir "icon.png"
if (-not (Test-Path $iconPath)) {
    # Create a simple 256x256 PNG icon
    Add-Type -AssemblyName System.Drawing
    $bitmap = New-Object System.Drawing.Bitmap(256, 256)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(3, 18, 37))
    
    # Draw NOMIS text
    $font = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(101, 195, 255))
    $graphics.DrawString("NOOOMIS", $font, $brush, 20, 100)
    
    $bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Host "Installing Electron..." -ForegroundColor Yellow
Set-Location $electronDir
npm init -y | Out-Null
npm install electron --save-dev | Out-Null
npm install electron-builder --save-dev | Out-Null

Write-Host "Building Windows executable..." -ForegroundColor Yellow
npm run build | Out-Null

Write-Host "Windows executable created successfully!" -ForegroundColor Green
Write-Host "Output directory: $OutputDir" -ForegroundColor Cyan

# Create a simple launcher batch file
$launcherPath = Join-Path $OutputDir "NOOOMIS.bat"
New-Item -ItemType Directory -Force -Path (Split-Path $launcherPath -Parent) | Out-Null
$launcherContent = @"
@echo off
cd /d "%~dp0electron"
start "" "node_modules\.bin\electron.cmd" .
"@

Set-Content -Path $launcherPath -Value $launcherContent -Encoding ASCII

Write-Host "Launcher created: $launcherPath" -ForegroundColor Cyan
Write-Host "You can now run NOOOMIS by double-clicking NOOOMIS.bat" -ForegroundColor Green

Set-Location $PSScriptRoot
