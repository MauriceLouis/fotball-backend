import os
import json
from datetime import datetime

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

today = datetime.now()
max_squad_size = 9
max_date = "30.06.2025"

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
    teams, fixtures = data[0], data[1]
    for team in fixtures:
        fixtures[team] = [pd.to_datetime(date, format="%d.%m.%Y") for date in fixtures[team]]

    # Trenger en tabell med oversikt over alle ivrigkampene
    df_ivrig = pd.read_csv("team_fixtures/input_csv_ivriglag.csv", sep=";", dtype={"Tid": "str"})
    df_ivrig = df_ivrig.query("Hjemmelag == 'KFUM Rød' | Bortelag == 'KFUM Rød'").copy()
    df_ivrig = df_ivrig.query("Bortelag != 'KFUM 5'")
    # Filtrere vekk kamper

    df_ivrig["Dato"] = pd.to_datetime(df_ivrig["Dato"], format="%d.%m.%Y")
    # Som må filtreres så vi gir litt beng i alt som har
    df_ivrig = df_ivrig[(df_ivrig["Dato"] > today) & (df_ivrig["Dato"] < max_date)]


    # Trenger en tabell med oversikt over alle spillerne + datoer de spiller + antall kamper
    df_teams = pd.DataFrame({"spiller": teams.keys(), "lag": teams.values()})

    df_teams["dato_base"] = df_teams["lag"].map(fixtures)
    df_teams["antall_kamper"] = 0

    # Må iterere over alle kampene i ivrig-verden og legge til spillere
    squad_dict = {}
    for Dato in df_ivrig["Dato"]:
        df_teams_inner = df_teams.sample(frac=1)
        df_teams_inner = df_teams_inner.sort_values(by="antall_kamper", ascending=True).copy()
        df_teams_inner["kollisjon"] = df_teams_inner["dato_base"].apply(lambda x: False if Dato not in x else True)

        df_teams_inner = df_teams_inner[df_teams_inner["kollisjon"] == False]
        squad = list(df_teams_inner["spiller"][:max_squad_size].values)

        for spiller in squad:
            df_teams.loc[df_teams["spiller"] == spiller, "antall_kamper"] += 1
        squad.sort()
        squad_dict[Dato] = squad
    df_ivrig["Tropp"] = df_ivrig["Dato"].map(squad_dict)
    df_ivrig["Antall_spillere"] = df_ivrig["Tropp"].str.len()

    cols_to_keep = ["Dato", "Tid", "Hjemmelag", "Bortelag", "Bane", "Tropp", "Antall_spillere"]
    df_ivrig["Dato"] = df_ivrig["Dato"].apply(lambda x: x.strftime("%d.%m.%Y"))

    json_data = df_ivrig[cols_to_keep].to_dict("records")

    # Skrive til Postgres? Kommer vel som en feature-request fra de kravstore brukerne våre!

    return jsonify(json_data)


if __name__ == '__main__':
    app.run(debug=True)