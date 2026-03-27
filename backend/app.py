from fastapi import FastAPI
from ml.mlEndpoint import MLService
from genAI.llmCalling import generate_study_plan

app = FastAPI()

ml_service = MLService()

@app.post("/predict")
def predict(data: dict):
    result = ml_service.predict(data)
    return result


# whenever someone calls generate_plan, first ensure that the ML model has been called and the result has appended to the prompt string
@app.post("/generate_plan")
def generate_plan(summary: str):
    plan = generate_study_plan(summary)
    return {"plan": plan}