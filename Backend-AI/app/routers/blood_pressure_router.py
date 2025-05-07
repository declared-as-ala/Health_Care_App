from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
from app.services.blood_pressure_service import predict_hypertension

router = APIRouter()

# Définir le schéma d'input
class BloodPressureInput(BaseModel):
    age: int
    systolic_pressure: float
    diastolic_pressure: float

@router.post("/blood_pressure/predict")
async def predict(data: BloodPressureInput):
    input_data = np.array([[ 
        data.age, data.systolic_pressure, data.diastolic_pressure
    ]])

    result = predict_hypertension(input_data)
    return {"prediction": result}