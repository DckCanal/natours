const dotenv = require('dotenv');
// console.log(process.env['LOGNAME']);

// Loading config file... these variables will be accessible from every .js file!
dotenv.config({ path: './config.env' });
// console.log(process.env);

// Import the app file only after reading the config file!
const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
