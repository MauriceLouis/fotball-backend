import os

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

source_csv = "favorite_meals.csv"
file_exists = True if os.path.isfile(source_csv) else False
if not file_exists:
    df = pd.DataFrame({"name": [], "favorite_meal": []})
    df.to_csv(source_csv, mode="w", sep=";", index=False)
    del df


app = Flask(__name__)
CORS(app)

# The first method
@app.route('/api/data', methods=['POST'])
def write_favorite_meal_for_person(name, meal):

    ## This is a hacky way to update the table. Replace with Postgres
    df_temp = pd.DataFrame({"name": [name], "favorite_meal": [meal]})
    df = pd.read_csv(source_csv, sep=";")
    df = df[df["name"] != name].copy()
    df = pd.concat([df, df_temp])

    df.to_csv(source_csv, mode="w", sep=";", index=False)

    return jsonify({"message": f"Følgende er lagt inn: {name} sitt favorittmåltid er {meal}"})


# The second method reads data from the source and returns the full table
@app.route('/api/data', methods=['GET'])
def get_favorite_meals():
    df = pd.read_csv(source_csv, sep=";")
    json_msg = df.to_json()

    return json_msg


if __name__ == '__main__':
    app.run(debug=True)