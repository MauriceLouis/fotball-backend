import React, { useState, useEffect } from 'react';


// Step 1: Add person`s name and favorite meal and write this to the csv-file before returning a message to the frontend
// Step 2: Read the csv-file and show the people and their favorite meals :)



function AddPersonsFavoriteMeal() {
    const [name, setName] = useState("")
    const [favoriteMeal, setFavoriteMeal] = useState("")
    const [personList, setPersonList] = useState([])
    const div = (<div>
        <form>
        <div className="mb-4 align-middle" style={{display: 'flex', flexDirection: 'row'}}>
        <label>
            Personens navn: <input name="navn" onChange = {e => setName(e.target.value)}/>
        </label>
            <label>
                Favorittmåltid: <input name="favorite_meal" onChange = {e => setFavoriteMeal(e.target.value)}/>
            </label>

        </div>
    </form>
        <button onClick = {e => setPersonList([... personList, {name: name, favoriteMeal: favoriteMeal }])} >  Legg til!</button>
        <button onClick = {e => setPersonList([])}> Fjern alt! </button>
    </div>)
        return {div: div, list: personList}

}


const App = () => {
    const [data, setData] = useState('')
    const functionReturn = AddPersonsFavoriteMeal()

    function exportData (){
        fetch('http://127.0.0.1:5000/api/data', {method: "PUT", body: JSON.stringify(functionReturn.list), headers: {'Content-Type': 'application/json'}})

    }

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
            {functionReturn.div}
            <h2>Summary of reported now (add a dashed line above this title)</h2>
            <ol>
                {functionReturn.list && functionReturn.list.map(i=><li>{i.name + ": " + i.favoriteMeal} </li>)}
            </ol>
            <button onClick = {exportData} >  Lagre preferanser! </button>

            <h2>Summary of reported previously</h2>
            <ol>
                {data && data.map(i=> <li> {i.name + ": " + i.favoriteMeal}</li>)}

            </ol>

        </div>
    );
};

export default App;