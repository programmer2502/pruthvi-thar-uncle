# AutoPulse AI: Vehicle Fault Detection & Solution System 🚗🤖

Welcome to AutoPulse AI, a modern, full-stack application for detecting vehicle faults using Machine Learning and OBD-II text inputs.

## 📂 Project Structure

Your project is clearly separated into frontend and backend domains:

```text
idp/
├── backend/
│   ├── dataset.csv            # Sample dataset with RPM, Temp, symptoms, DTC code
│   ├── fault_detection_model.pkl # Trained Random Forest Model
│   ├── main.py                # FastAPI Application and API logic
│   ├── requirements.txt       # Python dependencies
│   └── train_model.py         # Script to train ML model
└── frontend/
    ├── public/                # Static assets
    ├── src/
    │   ├── components/        # Reusable components (Navbar, Footer, etc.)
    │   ├── pages/             # App views (Home, Diagnose, About, Contact)
    │   ├── App.jsx            # React Router setup
    │   ├── index.css          # Vanilla CSS global definitions & glassmorphism
    │   └── main.jsx           # Entry point
    ├── package.json           # NPM dependencies
    └── index.html             # App shell window
```

## 🚀 Setup & Execution

You will need two terminal windows to run both the frontend and the backend simultaneously.

### 1️⃣ Start the Backend (FastAPI + ML Model)

Open a terminal and run the following:

```bash
cd c:\Users\navee\OneDrive\Desktop\idp\backend

# Install dependencies
pip install -r requirements.txt

# Run the training script directly to build learning model from sample dataset 
python train_model.py

# Spin up the FastAPI server
uvicorn main:app --reload --port 8000
```
Your API will be running at `http://localhost:8000`

### 2️⃣ Start the Frontend (Vite + React)

In a **second terminal**:

```bash
cd c:\Users\navee\OneDrive\Desktop\idp\frontend

# Install dependencies (If not already installed)
npm install

# Start the Vite development server
npm run dev
```
Open your browser to `http://localhost:5173` (or the URL Vite prints to the console).

## 🧠 Using The AI Diagnostics

Navigate to the `Diagnose AI` page. The form accepts:
- **Symptoms textual description**: Input common issues e.g. "Engine making a clicking sound." 
- **(Advanced) OBD-II Code**: E.g. "P0300" (Misfire code) 

Once you submit, the React frontend executes an asynchronous HTTP post to `/predict`. Wait a few seconds to see the premium result visualization showing:
1. Detected Fault name
2. Severity Bar Scale
3. Temp/Permanent Fix breakdowns
4. Estimated Local Repair costs in INR.

## 📄 API Documentation

FastAPI auto-generates interactive API dashboards. When the backend is running, you can hit:
- **Swagger UI documentation:** `http://localhost:8000/docs`

**POST /predict**

*Payload Data Format:*
```json
{
  "symptoms": "Engine shaking loss of power",
  "obd_data": {
    "rpm": 1500,
    "temp": 95,
    "dtc": "P0300"
  }
}
```

*Expected JSON Response Output:*
```json
{
  "fault": "Engine Misfire",
  "confidence": "92.0%",
  "severity": "High",
  "temporary_fix": "Avoid high speeds; pull over.",
  "permanent_fix": "Replace spark plugs or ignition coils.",
  "estimated_cost": "₹3000 - ₹8000"
}
```

## 🎨 Architectural Highlights
- **Stunning UI** using custom Vanilla CSS Variables for premium modern glassmorphic looks & subtle color gradients. Dark mode base matches professional AI tools.
- **Random Forest Scikit-learn Flow** transforms complex heterogeneous datatypes into simplified text-classes natively.
- **RESTful Endpoints** completely decoupled UI from machine-driven analytical results for future scale or app mobile creation.
