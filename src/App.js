import React, { useState, useEffect } from 'react';


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
                console.log(data)
                setTeamFixtures(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    return teamFixtures
}


// const [teamPlayers, setTeamPlayers]  = useState([])


// function AddPlayersToTeam(){}

const App = () => {
    const TeamFixtures = GetTeamFixtures()
    const [selectedTeam, setSelectedTeam] = useState("")
    const [teamSquad, setTeamSquad] = useState("")
    const handleChange = (event) => {
        setSelectedTeam(event.target.value);
    };
    const teams = Object.keys(TeamFixtures)
    return (
    <div>
              <h1>Legg til spillere per lag</h1>
             <div>
                 <label htmlFor="teamSelect"> Velg lag! </label>
                 <select id="teamSelect" value = {selectedTeam} onChange={handleChange}>
                     {teams.map(i => <option value={i} key={i}> {i}</option>)}
                 </select>
                 {console.log(selectedTeam)}
                 <input></input>
             </div>
          </div>
    )
}

export default App;