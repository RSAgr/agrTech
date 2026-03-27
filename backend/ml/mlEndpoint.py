import numpy as np
import pickle
import os


class MLService:
    def __init__(self):
        self.irrigation_model = self._load_model("backend/models/irrigation_model.pkl")
        self.disease_model = self._load_model("backend/models/disease_model.pkl")

    def _load_model(self, path):
        if os.path.exists(path):
            with open(path, "rb") as f:
                return pickle.load(f)
        return None  # fallback to rules if model not present

    # -----------------------------
    # MAIN ENTRY FUNCTION
    # -----------------------------
    def predict(self, data: dict):
        """
        Input:
        {
            "temperature": 34,
            "humidity": 70,
            "soil_moisture": 25
        }
        """

        irrigation = self._predict_irrigation(data)
        disease = self._predict_disease_risk(data)
        stress = self._detect_stress(data)

        return {
            "irrigation": irrigation,
            "disease_risk": disease,
            "crop_stress": stress
        }

    # -----------------------------
    # IRRIGATION
    # -----------------------------
    def _predict_irrigation(self, data):
        temp = data["temperature"]
        humidity = data["humidity"]
        moisture = data["soil_moisture"]

        if self.irrigation_model:
            X = np.array([[temp, humidity, moisture]])
            pred = self.irrigation_model.predict(X)[0]
            return "needed" if pred == 1 else "not_needed"

        # RULE-BASED FALLBACK
        if moisture < 30:
            return "needed"
        elif moisture < 45 and temp > 30:
            return "needed"
        return "not_needed"

    # -----------------------------
    # DISEASE RISK
    # -----------------------------
    def _predict_disease_risk(self, data):
        temp = data["temperature"]
        humidity = data["humidity"]

        if self.disease_model:
            X = np.array([[temp, humidity]])
            pred = self.disease_model.predict(X)[0]
            return ["low", "medium", "high"][pred]

        # RULE-BASED FALLBACK
        if humidity > 80 and 20 <= temp <= 30:
            return "high"
        elif humidity > 60:
            return "medium"
        return "low"

    # -----------------------------
    # STRESS DETECTION
    # -----------------------------
    def _detect_stress(self, data):
        temp = data["temperature"]
        moisture = data["soil_moisture"]

        if temp > 35 and moisture < 30:
            return "high"
        elif temp > 30:
            return "medium"
        return "low"