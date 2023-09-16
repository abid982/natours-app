const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log('Database:');
console.log(DB);

mongoose.connect(DB).then((connection) => {
    console.log('DB connection successfully...');
    console.log(connection.connections);
}).catch(err => console.log(err));

// const tourSchema = new mongoose.Schema({
//     name: String,
//     rating: Number,
//     price: Number
// });

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a number'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

// This is a new document that we created out of tour model or function constructors
// It is an instance of the Tour model
// const testTour = new Tour({
//     name: 'The Murre Trip',
//     rating: 4.8,
//     price: 697
// });
// A tour must have a price
const testTour = new Tour({
    name: 'The Sea Explorer',
    price: 997
});

// Save testTour document to the database
// Now this save method will return a promise that we can then consume
testTour.save().then(document => {
    console.log('Document:');
    console.log(document);
}).catch(err => {
    console.log('Error:', err);
});

const port = process.env.PORT || 3000;

// We get the env variable
console.log(app.get('env'));

// Node.js environment variables
console.log(process.env);

app.listen();

// To start a server use app.listen() method
// Pass port and a callback function and this callback function will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// const x = 23;
// x = 66;
