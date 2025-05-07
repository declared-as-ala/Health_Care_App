from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from app.services.diabetes_service import predict_diabetes

router = APIRouter()

# Définir le schéma d'input
class DiabetesInput(BaseModel):
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree: float
    age: int

@router.post("/diabetes/predict")
async def predict(data: DiabetesInput):
    input_data = np.array([[ 
        data.pregnancies, data.glucose, data.blood_pressure,
        data.skin_thickness, data.insulin, data.bmi,
        data.diabetes_pedigree, data.age
    ]])

    result = predict_diabetes(input_data)
    return {"prediction": result}
