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
