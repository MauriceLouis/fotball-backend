import React, { useState, useEffect } from 'react';


// Step 1: Add person`s name and favorite meal and write this to the csv-file before returning a message to the frontend
// Step 2: Read the csv-file and show the people and their favorite meals :)

function AddPersonsFavoriteMeal() {
    return <form>
        <div className="mb-4 align-middle" style={{display: 'flex', flexDirection: 'row'}}>
        <label>
            Personens navn: <input name="navn"/>
        </label>
            <label>
                Favorittmåltid: <input name="favorite_meal"/>
            </label>
            <button type="submit"> Legg til!</button>
        </div>
    </form>

}


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
            <h1>Our summary of people and food!</h1>
            <h2>Report the person`s favorite meal</h2>
            <AddPersonsFavoriteMeal></AddPersonsFavoriteMeal>

            <h2>Summary (add a dashed line above this title)</h2>
            <ol>
                {data && data.map(i=><li>{i.name + ": " + i.favorite_meal} </li>)}
            </ol>

        </div>
    );
};

export default App;