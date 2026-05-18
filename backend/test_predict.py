import requests

tests = [
    "engine symbol is shown in display",
    "engine noise knocking sound",
    "brakes squealing high pitch",
    "AC not blowing cold air",
    "car won't start dead battery",
    "temperature gauge high steam from hood",
    "pulling to one side drifts",
    "gears slipping won't shift up",
]

for symptom in tests:
    r = requests.post("http://localhost:8000/predict", json={
        "symptoms": symptom,
        "obd_data": {"rpm": 0, "temp": 80, "dtc": ""}
    })
    d = r.json()
    print(f"Symptom : {symptom}")
    print(f"  Fault : {d['fault']}")
    print(f"  Conf  : {d['confidence']}")
    print()
