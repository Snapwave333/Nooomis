import os
import requests

SAO_URL = os.getenv("SAO_URL", "")
SAO_TOKEN = os.getenv("SAO_TOKEN", "")

PAYLOADS = [
    {"prompt": "Short sine-like beep, green, cheerful", "seconds": 0.3, "out": "tone_green.wav"},
    {"prompt": "Short square-like beep, red, assertive", "seconds": 0.3, "out": "tone_red.wav"},
    {"prompt": "Short triangle-like beep, blue, bright", "seconds": 0.3, "out": "tone_blue.wav"},
    {"prompt": "Short saw-like beep, yellow, warm", "seconds": 0.3, "out": "tone_yellow.wav"},
    {"prompt": "Game start cue, positive", "seconds": 1.0, "out": "start.wav"},
    {"prompt": "Success jingle", "seconds": 1.0, "out": "success.wav"},
    {"prompt": "Fail buzzer", "seconds": 1.0, "out": "fail.wav"},
]

def gen_audio(payload):
    if not SAO_URL:
        print("SAO_URL not set; skipping audio generation.")
        return
    headers = {}
    if SAO_TOKEN:
        headers["Authorization"] = f"Bearer {SAO_TOKEN}"
    r = requests.post(SAO_URL, headers=headers, json={
        "prompt": payload["prompt"],
        "seconds": payload["seconds"]
    })
    r.raise_for_status()
    with open(payload["out"], "wb") as f:
        f.write(r.content)
    print("Saved", payload["out"])

if __name__ == "__main__":
    os.makedirs("audio", exist_ok=True)
    cwd = os.getcwd()
    os.chdir("audio")
    for p in PAYLOADS:
        try:
            gen_audio(p)
        except Exception as e:
            print("Failed", p["out"], e)
    os.chdir(cwd)