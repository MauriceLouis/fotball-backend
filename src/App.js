import React, { useState, useEffect } from 'react';

const App = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/data')
        .then(response => response.json())
            .then(data => {
                setData(data.message);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>React with Python</h1>
            <p>{data}</p>
        </div>
    );
};

export default App;