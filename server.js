const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

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
