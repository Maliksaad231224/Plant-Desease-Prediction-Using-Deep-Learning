# Plant Disease Prediction Using Deep Learning

This project uses a locally saved plant disease model with a FastAPI backend and a simple client for sending image files to the API.

## Project Layout

- `backend/` - FastAPI app, API client, and saved model artifacts
- `model/` - training and preprocessing code
- `data/` - dataset folders
- `frontend/` - frontend files

## Backend Setup With `uv`

These steps work on another machine or a fresh system.

1. Install `uv`. using
`pip install uv`
2. Clone the repository.
3. Open a terminal in the `backend/` folder.
4. Create and sync the local environment:

```bash
uv sync
```

This creates the backend virtual environment from `pyproject.toml` and `uv.lock`.

## Run The API

Start the FastAPI server from `backend/`:

```bash
uv run uvicorn main:app --reload
```

If you want to activate the environment manually on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

## Send An Image To The API

Use the simple client to upload an image to the prediction endpoint:

```bash
uv run python client.py path/to/image.jpg
```

Or specify the API URL explicitly:

```bash
uv run python client.py path/to/image.jpg --api-url http://127.0.0.1:8000/predict
```

## Notes

- The model files are stored in `backend/models/`.
- The API loads the checkpoint locally, so no external model service is required.
- The prediction endpoint expects a multipart upload field named `file`.