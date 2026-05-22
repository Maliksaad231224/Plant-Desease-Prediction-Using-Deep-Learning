from pathlib import Path
import sys

from fastapi import FastAPI, File, HTTPException, UploadFile


PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
BACKEND_DIR_STR = str(BACKEND_DIR)

if BACKEND_DIR_STR not in sys.path:
	sys.path.append(BACKEND_DIR_STR)

from predict import load_model, predict_pil_image  # noqa: E402


app = FastAPI(title="Plant Disease Prediction API")

model = None
classes = None


@app.on_event("startup")
def startup_event():
	global model, classes
	model, classes = load_model()


@app.get("/")
def health_check():
	return {"status": "ok", "message": "Plant disease prediction API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
	if model is None or classes is None:
		raise HTTPException(status_code=503, detail="Model is not loaded")

	if not file.content_type or not file.content_type.startswith("image/"):
		raise HTTPException(status_code=400, detail="Please upload a valid image file")

	try:
		from PIL import Image
		from io import BytesIO

		contents = await file.read()
		image = Image.open(BytesIO(contents)).convert("RGB")
		predictions = predict_pil_image(image, model=model, classes=classes, top_k=3)
	except Exception as exc:
		raise HTTPException(status_code=400, detail=f"Could not process image: {exc}") from exc

	best_prediction = predictions[0]
	return {
		"prediction": best_prediction["class_name"],
		"confidence": round(best_prediction["confidence"], 4),
		"top_predictions": predictions,
	}




