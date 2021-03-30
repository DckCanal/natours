const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

// console.log(process.env);
// console.log(process.env['LOGNAME']);
const start = async () => {
  const DB = process.env.DATABASE_URL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      //.connect(process.env.DATABASE_LOCAL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then((connection) => console.log('DB connection successful!'));

  const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
  );
  return tours;
};

const importData = async () => {
  const tours = await start();
  try {
    await Tour.create(tours);
    console.log('Tours successfully created');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  const tours = await start();
  try {
    await Tour.deleteMany();
    console.log('Tours successfully deleted');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};
//deleteData().then(importData);
// (async () => {
//   await deleteData();
//   importData();
// })();
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(`Usage: node import-dev-data.js
        --import    imports all data to the DB
        --delete    empties the DB`);
}
