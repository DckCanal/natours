// Loading config file... these variables will be accessible from every .js file!
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// console.log(process.env);
// console.log(process.env['LOGNAME']);

// Import the app file only after reading the config file!
const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
