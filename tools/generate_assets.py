import os
import json
import base64
import requests

API_KEY = os.getenv("STABILITY_API_KEY", "")

PROMPT = "Retro-futuristic neon NOMIS device button textures with glow, cohesive UI set"

def generate_image(prompt: str, out_path: str):
    if not API_KEY:
        print("No STABILITY_API_KEY set; skipping image generation.")
        return
    print("Generating image via Stability API...")
    # Example Stability API v1 image generation (placeholder endpoint)
    url = "https://api.stability.ai/v1/generation/text-to-image"
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    data = {"prompt": prompt, "width": 512, "height": 512}
    try:
        r = requests.post(url, headers=headers, json=data)
        r.raise_for_status()
        js = r.json()
        img_b64 = js.get("image", "")
        if img_b64:
            with open(out_path, "wb") as f:
                f.write(base64.b64decode(img_b64))
            print(f"Saved {out_path}")
        else:
            print("No image in response.")
    except Exception as e:
        print("Generation failed:", e)

if __name__ == "__main__":
    os.makedirs("assets", exist_ok=True)
    generate_image(PROMPT, os.path.join("assets", "buttons.png"))