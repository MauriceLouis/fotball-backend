import React, { useState, useEffect } from 'react';


// Step 1: Add person`s name and favorite meal and write this to the csv-file before returning a message to the frontend
// Step 2: Read the csv-file and show the people and their favorite meals :)


const App = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/data')
        .then(response => response.json())
            .then(data => {
                console.log(data)
                setData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>React with Python</h1>
            <ol>
                {data.map(i=><li>{i.name + ": " + i.favorite_meal} </li>)}
            </ol>

        </div>
    );
};

export default App;