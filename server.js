// require express
const express = require('express');

const PORT = process.env.PORT || 3001;

// initiate the server
const app = express();

// make our server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// require a route that the front-end can request data from
const {animals} = require('./data/animals');

// function to filter through the animals and return new array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// add the route 
    // get method requires two arguments
    // first argument = string that describes the route to fetch from
    // second argument = a callback function that executes every time
        // send method from res (short for response) to send string Hello! to client
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        
        results = filterByQuery(req.query, results);
    } 
    //console.log(req.query)
    res.json(animals);
});
