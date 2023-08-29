// Import 3rd party modules
const express = require('express');

// Assign the result of calling express
// This is actually a function which upon calling will add a bunch of methods to our app variable
const app = express();

// Define routes
// Remember that routing means basically to determine how an application responds to a certain client request so to a certain url right and actually it's not just the url but also the http method which is used for that request.
// Note: By using the json() method this will automatically set our content-type to 'application/json'
// 127.0.0.1:3000
app.get('/', (req, res) => {

    // Send data back as response to the client
    // res.status(200).send('Hello from the server side!');
    res.status(200).json({
        message: 'Hello from the server side!',
        app: 'Natours'
    })
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...');
});

// Create a port
const port = 3000;

app.listen();

// To start a server use app.listen() method
// Pass port and a callback function and this callback function will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

