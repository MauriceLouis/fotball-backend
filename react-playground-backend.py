import os

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

source_csv = "favorite_meals.csv"

file_exists = True if os.path.isfile(source_csv) else False
if not file_exists:
    df = pd.DataFrame({"name": ["Meng", "Louis"], "favorite_meal": ["Knekkebrød", "Dumplings"]})
    df.to_csv(source_csv, mode="w", sep=";", index=False)
    del df


app = Flask(__name__)
CORS(app)

# The first method
@app.route('/api/data', methods=['PUT'])
def write_favorite_meal_for_person():
    data = request.json
    names = [item["name"] for item in data]

    print(names)

    df_temp = pd.DataFrame(data)
    df = pd.read_csv(source_csv, sep=";")
    df = df[~df["name"].isin(names)].copy()
    df = pd.concat([df, df_temp])

    df.to_csv(source_csv, mode="w", sep=";", index=False)

    return jsonify({"message": f"Lagt til!"})



# The second method reads data from the source and returns the full table
@app.route('/api/data', methods=['GET'])
def get_favorite_meals():
    df = pd.read_csv(source_csv, sep=";")
    json_msg = df.to_dict()

    var = [{"name": "Meng", "favoriteMeal": "Knekkebrød"},
           {"name": "Louis", "favoriteMeal": "Dumplings"}]

    return jsonify(var)


if __name__ == '__main__':
    app.run(debug=True)