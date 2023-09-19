const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log('Database:');
console.log(DB);

mongoose.connect(DB).then((connection) => {
    console.log('DB connection successfully...');
    console.log(connection.connections);
}).catch(err => console.log(err));

// READ JSON FILE
// const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
// This dot here is always relative from the folder where the node application was actually started and so that's the home folder and so we're basically looking for this file here in the home folder. ./tours-simple.json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
console.log('All tours:');
console.log(tours);

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch(err) {
        console.log('Error in importing data');
        console.log(err);
    }
    // It's a kind of an aggressive way of stopping an application
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log('Error in deleting data');
        console.log(err);
    }
    process.exit();
};

// importData();
// deleteData();

// Learn a little bit about interacting with the command line
// The process. argv is a property that holds an array of command-line values provided when the current process was initiated.
// node dev-data/data/import-dev-data.js
if (process.argv[2] === '--import') {
    // Run import data
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
console.log('Process argv');
console.log(process.argv);
// [
//     '/usr/local/Cellar/node/20.6.1/bin/node',
//     '/Users/abid/Documents/Node.js, Express, MongoDB & More The Complete Bootcamp 2023/natours-app/dev-data/data/import-dev-data.js',
//     '--import'
//   ]
