
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load Kaggle dataset
df = pd.read_csv("StudentsPerformance.csv")


# API 1: Basic dashboard statistics
@app.route("/api/stats")
def get_stats():

    return jsonify({
        "total_students": int(len(df)),

        "average_math": round(
            float(df["math score"].mean()), 2
        ),

        "average_reading": round(
            float(df["reading score"].mean()), 2
        ),

        "average_writing": round(
            float(df["writing score"].mean()), 2
        )
    })


# API 2: Gender-wise performance
@app.route("/api/gender")
def get_gender():

    result = df.groupby("gender")[
        ["math score", "reading score", "writing score"]
    ].mean().round(2)

    return jsonify(
        result.reset_index().to_dict(orient="records")
    )


# API 3: All student records
@app.route("/api/students")
def get_students():

    return jsonify(
        df.to_dict(orient="records")
    )


# Start backend server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
