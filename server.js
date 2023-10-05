const process = require('node:process');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err);
  console.log(`${err.name} - ${err.message}`);

  process.exit(1);
});

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
console.log('Database:');
// console.log(DB);

mongoose
  .connect(DB)
  .then(connection => {
    console.log('DB connection successfully...');
    // console.log(connection.connections);
  })
  .catch(err => {
    console.log(err);
    console.log(err.name);
    console.log(err.message);
  });

// const tourSchema = new mongoose.Schema({
//     name: String,
//     rating: Number,
//     price: Number
// });

// This is a new document that we created out of tour model or function constructors
// It is an instance of the Tour model
// const testTour = new Tour({
//     name: 'The Murre Trip',
//     rating: 4.8,
//     price: 697
// });
// A tour must have a price
// const testTour = new Tour({
//     name: 'The Sea Explorer',
//     price: 997
// });

const port = process.env.PORT || 3000;

// We get the env variable
// console.log(app.get('env'));

// Node.js environment variables
// console.log(process.env);

app.listen();

// To start a server use app.listen() method
// Pass port and a callback function and this callback function will be called as soon as the server starts listening
// The result of calling app.listen() method is a server so store it into a variable
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// const x = 23;
// x = 66;

// process.on('unhandledRejection', err => {
//   console.log('Undandled rejection:');
//   console.log(err.name, err.message);

//   console.log('UNHANDLED REJECTION! 🔥 Shutting down...');

//   // process.exit(1);
//   // Basically if you want to exit with success use 0 if you want to exit with failure use 1.

//   server.close(() => {
//     process.exit(1);
//   });
// });

// console.log(x);

// process.on('uncaughtException', err => {
//   console.log(err);
//   console.log('UNCAUGHT EXCEPTION');
// });

// process
//   .on('unhandledRejection', (reason, p) => {
//     console.error(reason, 'Unhandled Rejection at Promise', p);
//   })
//   .on('uncaughtException', err => {
//     console.error(err, 'Uncaught Exception thrown');
//     process.exit(1);
//   });

// console.log(x);
