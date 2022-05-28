const fs = require('fs');
const path = require('path');

// require express
const express = require('express');

const PORT = process.env.PORT || 3001;

// initiate the server
const app = express();

// middleware that instructs the server to make our css readily available
    // this makes the files static resources
app.use(express.static('public'));

// parse incoming string or array data
         // USE is a method that mounts a fucntion to the server 
        //that our requests will pass through before getting to the intended endpoint
        // these are known as middleware functions
app.use(express.urlencoded({ extended: true }));
// the method above takes incoming POST data and converts it to key/value pairings
        // that can be accessed in the req.body object
        // the extened:true informs our server that there may be sub-array data nested in it as well

// parse incoming JSON data
        // express.json takes incoming POST data in the form of JSON 
        // and parses it into the req.body JS object
app.use(express.json());
        // both middleware functions above need to be set up every time we create a server 
        // thats's looking to accept POST data

// the forward slash brings us to the root route of the server
    // used to create a homepage for a server
    // displays the html
app.get('/', (req, res) => {
    // this points to the file we want the server to read and send back to client
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// /animal endpoint serves an HTML page
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// the route for the zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// wildcard request, any route that wasn't defiined previously will fall under this request
    // the * should always come last 
app.get('#', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function that accepts the POST route's req.body value and the array to add the data to
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // synchronous version of fs.writeFile() and doesn't require a callback function
        // this works for smaller data sets
    fs.writeFileSync(
        // use path.join() to write animals.json file in the data subdirectory
        path.join(__dirname, './data/animals.json'),
        // save the array data as JSON by converting it
            // null and 2 are means of keeping data formatted
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    //console.log(body);
    // our function's main code will go here!

    // return finished code to post route for response
    return animal;
}

// validation checks
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;  
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
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

// a route that listens for GET requests
// endpoints that include /api refer to JSON data being transferred
    // a GET request is made every time we enter a URL into the browser and press ENTER
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
    }
});

// POST requests represent the action of a client requesting the server to accept data
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be 
        // the req.body property is where we can access the data on the server side 
        // and do something with it
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // res.status().send is a response method to relay a message to the client making a req
        // anything in the 400 range indicates user error 
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
    //console.log(req.body);
    
});
