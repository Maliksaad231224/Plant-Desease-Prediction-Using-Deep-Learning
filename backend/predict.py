import argparse
import json
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torchvision import models, transforms


MODEL_DIR = Path(__file__).parent / "models"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = 224


def get_inference_transform():
    return transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])


def build_model(num_classes):
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)
    return model.to(DEVICE)


def load_classes(classes_path):
    with open(classes_path, "r", encoding="utf-8") as file:
        return json.load(file)


def load_checkpoint(model_path):
    checkpoint = torch.load(model_path, map_location=DEVICE)

    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
        classes = checkpoint.get("classes")
        num_classes = checkpoint.get("num_classes")
    else:
        state_dict = checkpoint
        classes = None
        num_classes = None

    return state_dict, classes, num_classes


def load_model(model_path=None, classes_path=None):
    model_path = Path(model_path) if model_path else MODEL_DIR / "best_model.pth"
    classes_path = Path(classes_path) if classes_path else MODEL_DIR / "classes.json"

    state_dict, checkpoint_classes, checkpoint_num_classes = load_checkpoint(model_path)

    if checkpoint_classes is not None:
        classes = checkpoint_classes
    else:
        classes = load_classes(classes_path)

    num_classes = checkpoint_num_classes or len(classes)

    model = build_model(num_classes)
    model.load_state_dict(state_dict)
    model.eval()

    return model, classes


def predict_image(image_path, model=None, classes=None, model_path=None, classes_path=None, top_k=3):
    if model is None or classes is None:
        model, classes = load_model(model_path=model_path, classes_path=classes_path)

    image_path = Path(image_path)
    image = Image.open(image_path).convert("RGB")

    return predict_pil_image(image, model=model, classes=classes, top_k=top_k)


def predict_pil_image(image, model=None, classes=None, model_path=None, classes_path=None, top_k=3):
    if model is None or classes is None:
        model, classes = load_model(model_path=model_path, classes_path=classes_path)

    transform = get_inference_transform()
    image_tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        outputs = model(image_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

    top_k = max(1, min(top_k, len(classes)))
    top_probabilities, top_indices = torch.topk(probabilities, k=top_k)

    predictions = [
        {
            "class_index": index.item(),
            "class_name": classes[index.item()],
            "confidence": probability.item(),
        }
        for probability, index in zip(top_probabilities, top_indices)
    ]

    return predictions


def main():
    parser = argparse.ArgumentParser(description="Predict plant disease from a single image.")
    parser.add_argument("image", help="Path to the image file")
    parser.add_argument(
        "--model-path",
        default=str(MODEL_DIR / "best_model.pth"),
        help="Path to the trained model checkpoint",
    )
    parser.add_argument(
        "--classes-path",
        default=str(MODEL_DIR / "classes.json"),
        help="Path to the class-name JSON file",
    )
    parser.add_argument("--top-k", type=int, default=3, help="Number of predictions to print")

    args = parser.parse_args()

    predictions = predict_image(
        args.image,
        model_path=args.model_path,
        classes_path=args.classes_path,
        top_k=args.top_k,
    )

    print(f"Image: {args.image}")
    for rank, prediction in enumerate(predictions, start=1):
        confidence = prediction["confidence"] * 100
        print(f"{rank}. {prediction['class_name']} ({confidence:.2f}%)")


if __name__ == "__main__":
    main()