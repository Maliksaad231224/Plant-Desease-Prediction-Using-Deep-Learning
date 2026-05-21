import os
import numpy as np
from pathlib import Path
from PIL import Image
from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import torch

# ── Paths ──────────────────────────────────────────────
DATA_DIR = Path(__file__).parent.parent / "data" / "color"

# ── Settings ───────────────────────────────────────────
IMG_SIZE = 224
BATCH_SIZE = 32
SEED = 42

# ── Custom Dataset class ────────────────────────────────
# Why? Because after we split with sklearn we have lists of file paths
# and labels — we need a PyTorch Dataset to wrap them so DataLoader
# can batch and feed them to the model
class PlantDataset(Dataset):
    def __init__(self, image_paths, labels, transform=None):
        self.image_paths = image_paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        # Open image, convert to RGB (some images might be RGBA or grayscale)
        image = Image.open(self.image_paths[idx]).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, self.labels[idx]


def get_transforms():
    # Training — with augmentation
    train_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    # Validation/test — no augmentation
    val_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    return train_transform, val_transform


def load_dataset_paths():
    # Collect all image paths and their labels
    image_paths = []
    labels = []
    classes = sorted(os.listdir(DATA_DIR))

    for class_idx, class_name in enumerate(classes):
        class_dir = DATA_DIR / class_name
        for img_file in os.listdir(class_dir):
            if img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_paths.append(str(class_dir / img_file))
                labels.append(class_idx)

    return image_paths, labels, classes


def check_class_balance(labels, classes):
    counts = np.bincount(labels)
    print("\nClass balance check:")
    for i, cls in enumerate(classes):
        print(f"  {cls}: {counts[i]}")
    print(f"\nMin: {counts.min()} | Max: {counts.max()} | Avg: {int(counts.mean())}")
    print(f"Imbalance ratio: {counts.max()/counts.min():.1f}x")


def load_data():
    print("Loading dataset paths...")
    image_paths, labels, classes = load_dataset_paths()

    print(f"Total images: {len(image_paths)}")
    print(f"Total classes: {len(classes)}")

    check_class_balance(labels, classes)

    # First split — separate test set (15%)
    # stratify=labels ensures every class is proportionally represented in each split
    train_val_paths, test_paths, train_val_labels, test_labels = train_test_split(
        image_paths, labels,
        test_size=0.15,
        random_state=SEED,
        stratify=labels        # ← this is the key fix for class imbalance
    )

    # Second split — separate validation from training (15% of total)
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        train_val_paths, train_val_labels,
        test_size=0.176,       # 0.176 of 85% ≈ 15% of total
        random_state=SEED,
        stratify=train_val_labels
    )

    print(f"\nSplit sizes:")
    print(f"  Training:   {len(train_paths)} images (70%)")
    print(f"  Validation: {len(val_paths)} images (15%)")
    print(f"  Testing:    {len(test_paths)} images (15%)")

    train_transform, val_transform = get_transforms()

    # Create datasets
    train_dataset = PlantDataset(train_paths, train_labels, transform=train_transform)
    val_dataset   = PlantDataset(val_paths,   val_labels,   transform=val_transform)
    test_dataset  = PlantDataset(test_paths,  test_labels,  transform=val_transform)

    # Create dataloaders
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True,  num_workers=0)
    val_loader   = DataLoader(val_dataset,   batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    test_loader  = DataLoader(test_dataset,  batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    print("\nDataLoaders created successfully with stratified splits")

    return train_loader, val_loader, test_loader, classes


if __name__ == "__main__":
    load_data()