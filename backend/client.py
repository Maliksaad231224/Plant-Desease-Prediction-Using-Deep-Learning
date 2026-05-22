import argparse
from pathlib import Path

import requests


def send_image(api_url, image_path):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with image_path.open("rb") as image_file:
        files = {"file": (image_path.name, image_file, "image/jpeg")}
        response = requests.post(api_url, files=files, timeout=60)

    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser(description="Send an image to the plant disease API.")
    parser.add_argument("image", help="Path to the image file")
    parser.add_argument(
        "--api-url",
        default="http://127.0.0.1:8000/predict",
        help="FastAPI prediction endpoint",
    )

    args = parser.parse_args()

    result = send_image(args.api_url, args.image)
    print(result)


if __name__ == "__main__":
    main()