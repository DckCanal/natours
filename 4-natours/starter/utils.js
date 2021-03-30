const fs = require('fs/promises');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

(async () => {
  //   const tours = JSON.parse(
  //     await fs.readFile(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
  //   );
  //   await mongoose.connect(DB, {
  //     useNewUrlParser: true,
  //     useCreateIndex: true,
  //     useFindAndModify: false,
  //     useUnifiedTopology: true,
  //   });
  //   try {
  //     await Tour.create(tours);
  //   } catch (err) {
  //     console.log(err);
  //   }

  const [tours, connection] = await Promise.all([
    fs.readFile(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
    mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
  ]);
  await Tour.deleteMany();
  console.log('DB empty');
  try {
    await Tour.create(JSON.parse(tours));
    console.log('DB populated');
  } catch (err) {
    console.log(err);
  }
})();

// const loadDataToDB = function (path) {
//   fs.readFile(path, 'UTF-8', (err, data) => {
//     const tours = JSON.parse(data);
//     mongoose
//       .connect(DB, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true,
//       })
//       .then((connection) => {
//         console.log('DB connected');
//         //console.log(tours);
//         tours.forEach((tour) => {
//           try {
//             Tour.create(tour);
//           } catch (error) {
//             console.error(error);
//           }
//         });
//       });
//   });
// };
// loadDataToDB(`${__dirname}/dev-data/data/tours-simple.json`);
