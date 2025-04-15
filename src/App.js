import React, { useState, useEffect } from 'react';

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto'
};

const tableHeaderCellStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f0f0f0',
    color: '#555',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const tableCellStyle = {
    padding: '8px',
    borderBottom: '1px solid #ddd',
};

const tableRowHoverStyle = {
    backgroundColor: '#f5f5f5',
};

const inputStyle = {
    borderRadius: '4px',
    border: '1px solid #ccc',
    padding: '8px',
    width: '100%',
    maxWidth: '300px',
    boxSizing: 'border-box',
    focus: {
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
    },
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
    hover: {
        backgroundColor: '#45a049',
    },
    focus: {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.3)',
    },
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontSize: '0.9rem',
    fontWeight: 'bold',
};

function ObjectTable({ data, includedKeys }) {
    // Function to safely handle nested properties
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part] ? acc[part] : null, obj);
    };

    // Determine headers.  If includedKeys are provided, use those, otherwise,
    const headers = includedKeys || (data.length > 0 ? Object.keys(data[0]) : []);

    // Function to generate table rows
    const generateRows = (rowDataArray) => {
        return rowDataArray.map((rowData, index) => (
            <tr key={index} style={tableRowHoverStyle}>
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
                        <td key={header} style={tableCellStyle}>
                            {displayValue}
                        </td>
                    );
                })}
            </tr>
        ));
    };

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={tableStyle}>
                <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header} style={tableHeaderCellStyle}>
                            {header}
                        </th>
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


function GetTeamFixtures() {
    const [teamFixtures, setTeamFixtures] = useState("");
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
    return teamFixtures;
}


function PlayerTeamTable({ players }) {
    return (
        <table style={{ ...tableStyle, marginTop: '20px' }}>
            <thead>
            <tr>
                <th style={tableHeaderCellStyle}>Spiller</th>
                <th style={tableHeaderCellStyle}>Lag</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(players).map(([player, team]) => (
                <tr key={player} style={tableRowHoverStyle}>
                    <td style={tableCellStyle}>{player}</td>
                    <td style={tableCellStyle}>{team}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const App = () => {
    const TeamFixtures = GetTeamFixtures();
    const [selectedTeam, setSelectedTeam] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerTeams, setPlayerTeams] = useState({});
    const [squads, setSquads] = useState([{"tom": "tabell"}]);

    const handleChangeTeam = (event) => {
        setSelectedTeam(event.target.value);
    };
    const handleChangePlayerName = (event) => {
        setPlayerName(event.target.value);
    };
    const handleAddPlayerToTeam = () => {
        if (!playerName || !selectedTeam) return;
        setPlayerTeams((prevPlayerTeams) => ({
            ...prevPlayerTeams,
            [playerName]: selectedTeam,
        }));
        setPlayerName("");
        console.log(playerTeams);
    }

    const teams = Object.keys(TeamFixtures);

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
            setSquads(result);
            console.log("Dette er squads ass: ", squads);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>Legg til spillere per lag</h1>
            <div style={{ marginBottom: '24px' }}>
                <label htmlFor="teamSelect" style={labelStyle}>
                    Velg lag:
                </label>
                <select
                    id="teamSelect"
                    value={selectedTeam}
                    onChange={handleChangeTeam}
                    style={inputStyle}
                >
                    <option value={""}>Velg lag</option>
                    {teams.map(i => <option value={i} key={i}> {i}</option>)}
                </select>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <input
                        id="playerName"
                        value={playerName}
                        onChange={handleChangePlayerName}
                        placeholder="Skriv inn spillerens navn"
                        style={inputStyle}
                    />
                    <button
                        onClick={handleAddPlayerToTeam}
                        style={buttonStyle}
                    >
                        Legg til spiller!
                    </button>
                </div>
                <PlayerTeamTable players={playerTeams} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '32px', marginBottom: '24px', color: '#333' }}>Kamptropper</h1>
            <button
                onClick={handleSend}
                style={buttonStyle}
            >
                Lag kamptropper!
            </button>
            <div style={{ marginTop: '16px' }}>
                <ObjectTable data={squads} />
            </div>
        </div>
    );
}

export default App;