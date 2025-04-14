import React, { useState, useEffect } from 'react';


function ObjectTable({ data, includedKeys }) {
    // Function to safely handle nested properties
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part] ? acc[part] : null, obj);
    };

    // Determine headers.  If includedKeys are provided, use those, otherwise,
    // get all unique keys from the *first* data item.
    const headers = includedKeys || (data.length > 0 ? Object.keys(data[0]) : []);

    // Function to generate table rows
    const generateRows = (rowDataArray) => {
        return rowDataArray.map((rowData, index) => (
            <tr key={index}>
                {headers.map((header) => {
                    const value = getNestedValue(rowData, header);
                    let displayValue;

                    if (value === null) {
                        displayValue = "N/A";
                    } else if (typeof value === 'object') {
                        if (Array.isArray(value)) {
                            displayValue = value.join(', ');
                        } else {
                            displayValue = JSON.stringify(value);
                        }
                    } else {
                        displayValue = String(value);
                    }
                    return (
                        <td key={header}>{displayValue}</td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div className="w-full">
            <table>
                <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {generateRows(data)}
                </tbody>
            </table>
        </div>
    );
}


// Fetch the csv-files from the backend and set TeamFixtures
// Use KFUM-teams as options in the dropdown
// Create a <form> and render the dropdown as well as input-boxes and a button
// This function should return an array where you have [{key = team, values = [names]   }]
// Then you display all the teams
// Before you hit the button, send the teams to the backend, which then set up the squads for the matches
// ...which is returned and displayed
// ...and then you can save it to a csv-file/database

function GetTeamFixtures()   {
    const [teamFixtures, setTeamFixtures] = useState("")
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/get_fixtures")
            .then(response => response.json())
            .then(data => {
                setTeamFixtures(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    return teamFixtures
}


function PlayerTeamTable({ players }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Spiller</th>
                <th>Lag</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(players).map(([player, team]) => (
                <tr key={player}>
                    <td>{player}</td>
                    <td>{team}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const App = () => {
    const TeamFixtures = GetTeamFixtures()
    const [selectedTeam, setSelectedTeam] = useState("")
    const [playerName, setPlayerName] = useState("")
    const [playerTeams, setPlayerTeams] = useState({})
    const [squads, setSquads] =  useState([{"tom": "tabell"}])

    const handleChangeTeam = (event) => {
        setSelectedTeam(event.target.value);
    };
    const handleChangePlayerName = (event) => {setPlayerName(event.target.value)}
    const handleAddPlayerToTeam = () => {
            if (!playerName || !selectedTeam) return;
            setPlayerTeams((prevPlayerTeams)  => ({...prevPlayerTeams, [playerName]: selectedTeam,}));
            setPlayerName("");
            console.log(playerTeams)
    }

    const teams = Object.keys(TeamFixtures)

    const [response, setResponse] = useState("")

    const handleSend = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/generate_squad', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([playerTeams, TeamFixtures]),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSquads(result)
            console.log("Dette er squads ass: ", squads)


        } catch (error) {
            console.error('Error sending data:', error);
        }


    }


    return (
    <div>
              <h1>Legg til spillere per lag</h1>
             <div>
                 <label htmlFor="teamSelect"> Velg lag! </label>
                 <select id="teamSelect" value = {selectedTeam} onChange={handleChangeTeam}>
                     <option value={""}>Velg lag</option>
                     {teams.map(i => <option value={i} key={i}> {i}</option>)}
                 </select>
                 <input id="playerName" value={playerName} onChange={handleChangePlayerName}/>
                 <button onClick={handleAddPlayerToTeam}> Legg til spiller! </button>
                 <PlayerTeamTable players={playerTeams} />

             </div>
        <h1 style ={{marginTop: "20px"}}> Kamptropper </h1>
        <button onClick={handleSend}> Lag kamptropper! </button>
        <div style ={{marginTop: "20px"}}></div>
        <ObjectTable data={squads} />
          </div>
    )
}

export default App;