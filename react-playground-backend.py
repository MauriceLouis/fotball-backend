import os
import json
from datetime import date, datetime

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

today = date.today()
max_squad_size = 9

app = Flask(__name__)
CORS(app)


# Fetching fixtures:
@app.route('/api/get_fixtures', methods=['GET'])
def get_fixtures_for_teams():
    print("get fixtures called!")
    dir = "team_fixtures"
    kfum_teams = ["KFUM 1", "KFUM 2", "KFUM 3"]
    ivriglag = "KFUM Rød"
    csv_files = [file for file in os.listdir(dir) if file.split(".")[-1] == "csv"]
    team_dict = {}
    for file in csv_files:
        file = f"{dir}/{file}"
        df = pd.read_csv(file, sep=";")
        df.columns = [col.lower() for col in df.columns]
        if "ivrig" in file:
            kamper = list(df[(df["hjemmelag"].str.contains(ivriglag)) |(df["bortelag"].str.contains(ivriglag))]["dato"].unique())
            key = ivriglag.replace(" ", "_").replace("Rød", "Red")
            team_dict[key] = kamper
        else:
            for team in kfum_teams:
                kamper = list(df[(df["hjemmelag"].str.contains(team)) |(df["bortelag"].str.contains(team))]["dato"].unique())
                if len(kamper) > 0:
                    key = team.replace(" ", "_")
                    team_dict[key] = kamper

    return json.dumps(team_dict)



# The first method
@app.route('/api/generate_squad', methods=['PUT'])
def generate_squads():
    data = request.json
    print("generate_squad called!")
    df_teams = pd.DataFrame({"spiller": data.keys(), "lag": data.values()})

    # Trenger å hente opp ivriglag-kampene
    # Trenger å

    return jsonify({"message": f"Lagt til!"})






if __name__ == '__main__':
    app.run(debug=True)