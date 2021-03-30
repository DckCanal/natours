const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const loadDataToDB = function (path) {
  fs.readFile(path, 'UTF-8', (err, data) => {
    const tours = JSON.parse(data);
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then((connection) => {
        console.log('DB connected');
        //console.log(tours);
        tours.forEach((tour) => {
          try {
            Tour.create(tour);
          } catch (error) {
            console.error(error);
          }
        });
      });
  });
};
loadDataToDB(`${__dirname}/dev-data/data/tours-simple.json`);
