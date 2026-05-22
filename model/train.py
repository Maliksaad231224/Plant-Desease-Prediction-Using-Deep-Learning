import torch
import torch.nn as nn
from torchvision import models
from pathlib import Path
import json
import time
from preprocess import load_data
from sklearn.metrics import precision_score, recall_score, f1_score

MODEL_DIR = Path(__file__).parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
import json
from pathlib import Path

BATCH_LOG_PATH = MODEL_DIR / "batch_logs.jsonl"
EPOCHS = 1
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def build_model(num_classes):
    print(f"Building MobileNetV2 model...")

    # Load MobileNetV2 pretrained on ImageNet
    # pretrained=True means it already knows how to detect edges, textures, shapes
    model = models.mobilenet_v2(weights="IMAGENET1K_V1")

    # Freeze all layers except the last one
    # Why? We don't want to change what it already learned from ImageNet
    # We only want to teach it our 38 plant disease classes
    for param in model.parameters():
        param.requires_grad = False

    # Replace the last layer with our own (38 classes instead of 1000)
    model.classifier[1] = nn.Linear(model.last_channel, num_classes)

    return model.to(DEVICE)


def train_one_epoch(model, loader, optimizer, criterion):
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(loader):
        images, labels = images.to(DEVICE), labels.to(DEVICE)

        optimizer.zero_grad()          # clear previous gradients
        outputs = model(images)        # forward pass
        loss = criterion(outputs, labels)  # calculate how wrong we are
        loss.backward()               # backpropagation
        optimizer.step()              # update weights

        total_loss += loss.item()
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += labels.size(0)

        if batch_idx % 50 == 0:
            print(f"  Batch {batch_idx}/{len(loader)} — Loss: {loss.item():.4f}")

    accuracy = 100 * correct / total
    avg_loss = total_loss / len(loader)
    return accuracy, avg_loss


def validate(model, loader, criterion):
    model.eval()

    total_loss = 0
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()

            _, predicted = outputs.max(1)

            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())

    accuracy = 100 * (sum([p == t for p, t in zip(all_preds, all_labels)]) / len(all_labels))

    precision = precision_score(all_labels, all_preds, average="macro")
    recall = recall_score(all_labels, all_preds, average="macro")
    f1 = f1_score(all_labels, all_preds, average="macro")

    avg_loss = total_loss / len(loader)

    return accuracy, avg_loss, precision, recall, f1

def train():
    print(f"Using device: {DEVICE}")
    print(f"Starting training for {EPOCHS} epochs\n")

    # Load data
    train_loader, val_loader, test_loader, classes = load_data()
    num_classes = len(classes)

    # Save class names — needed later for inference
    with open(MODEL_DIR / "classes.json", "w") as f:
        json.dump(classes, f)
    print(f"Saved {num_classes} class names\n")

    # Build model
    model = build_model(num_classes)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    # Training loop
    history = []
    best_val_acc = 0

    for epoch in range(EPOCHS):
        print(f"\nEpoch {epoch+1}/{EPOCHS}")
        print("-" * 40)

        start = time.time()
        train_acc, train_loss = train_one_epoch(model, train_loader, optimizer, criterion)
        val_acc, val_loss, val_prec, val_rec, val_f1 = validate(model, val_loader, criterion)
        elapsed = time.time() - start

        print(f"\n  Train Acc: {train_acc:.2f}% | Train Loss: {train_loss:.4f}")
        print(f"  Val Acc:   {val_acc:.2f}% | Val Loss:   {val_loss:.4f}")
        print(f"  Time: {elapsed:.1f}s")

        history.append({
    "epoch": epoch + 1,
    "train_acc": train_acc,
    "train_loss": train_loss,
    "val_acc": val_acc,
    "val_loss": val_loss,
    "val_precision": val_prec,
    "val_recall": val_rec,
    "val_f1": val_f1
})


        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save({
    "model_state_dict": model.state_dict(),
    "num_classes": num_classes,
    "classes": classes
}, MODEL_DIR / "best_model.pth")
            print(f"  ✓ Best model saved (val_acc: {val_acc:.2f}%)")

    # Save training history
    with open(MODEL_DIR / "history.json", "w") as f:
        json.dump(history, f, indent=2)

    print(f"\nTraining complete. Best validation accuracy: {best_val_acc:.2f}%")
    return model, test_loader, classes


if __name__ == "__main__":
    train()