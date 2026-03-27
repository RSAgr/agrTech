from fastapi import FastAPI
from services.ml_service import MLService

app = FastAPI()

ml_service = MLService()

@app.post("/predict")
def predict(data: dict):
    result = ml_service.predict(data)
    return result