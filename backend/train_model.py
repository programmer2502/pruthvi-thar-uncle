import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import joblib

def main():
    print("Loading dataset...")
    df = pd.read_csv('dataset.csv')
    
    # Fill NA values
    df['dtc'] = df['dtc'].fillna('None')
    df['symptoms'] = df['symptoms'].fillna('')
    X = df[['dtc', 'symptoms']]
    y = df['fault']
    
    # Preprocessor with advanced Text extraction
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['dtc']),
            ('text', TfidfVectorizer(max_features=200, ngram_range=(1, 2), stop_words='english'), 'symptoms')
        ])
    
    # Pipeline with balanced weights
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', RandomForestClassifier(random_state=42, n_estimators=150, max_depth=15, class_weight='balanced'))
    ])
    
    print("Training model...")
    pipeline.fit(X, y)
    
    print(f"Model Training Accuracy on full set: {pipeline.score(X, y) * 100:.2f}%")
    
    print("Saving model...")
    joblib.dump(pipeline, 'fault_detection_model.pkl')
    print("Model saved to fault_detection_model.pkl")

if __name__ == "__main__":
    main()
