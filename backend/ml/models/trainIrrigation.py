import pandas as pd
import numpy as np
import pickle
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------
# LOAD DATA
# -----------------------------
def load_data(path):
    df = pd.read_csv(path)
    return df


# -----------------------------
# PREPROCESSING
# -----------------------------
def preprocess(df):
    # Rename columns if needed (adjust based on dataset)
    df.columns = [col.lower() for col in df.columns]

    # Example expected columns:
    # ['soil_type', 'seedling_stage', 'moi', 'temp', 'humidity', 'result']

    X = df.drop("result", axis=1)
    y = df["result"]

    # Identify column types
    numerical_cols = ["moi", "temp", "humidity"]
    categorical_cols = ["crop_id", "soil_type", "seedling_stage"]

    # Preprocessing pipeline
    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ])

    return X, y, preprocessor


# -----------------------------
# TRAIN MODEL
# -----------------------------
def train_model(X, y, preprocessor):
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline.fit(X_train, y_train)

    # Evaluation
    y_pred = pipeline.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    return pipeline


# -----------------------------
# SAVE MODEL
# -----------------------------
def save_model(model, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved at {path}")

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    DATA_PATH = "D:/AgrTech/backend/ml/data/irrigation.csv"
    MODEL_PATH = "./irrigation_model.pkl"

    df = load_data(DATA_PATH)

    X, y, preprocessor = preprocess(df)

    model = train_model(X, y, preprocessor)

    save_model(model, MODEL_PATH)