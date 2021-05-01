const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

// exports.checkID = (req, res, next, val) => {
//   // console.log(`CheckID run! ${val}`);
//   // const tour = tours.find((t) => t.id === req.params.id * 1);
//   // if (!tour) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'Invalid ID',
//   //   });
//   // }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing tour name',
//     });
//   }
//   if (!req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing tour price',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  // send all the data about the tours
  try {
    // Building the query

    // 1A) Filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const excludedFields = ['fields', 'sort', 'page', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matchedStr) => `$${matchedStr}`
    );
    let query = Tour.find(JSON.parse(queryStr));

    /*
    const query = Tour.find()
      .where('duration').gte(5)
      .where('difficulty').equals('easy');

    */

    // 2) Sorting
    if (req.query.sort) {
      // mongoose syntax: sort('price ratingsAverage')
      query = query.sort(req.query.sort.split(',').join(' '));
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting -> projecting
    if (req.query.fields) {
      // mongoose syntax: select('name duration price -excludedField')
      query = query.select(req.query.fields.split(',').join(' '));
    } else {
      query = query.select('-__v');
    }

    // Executing the query
    const tours = await query;

    // JSEND standard
    res.status(200).json({
      status: 'success',
      results: tours.length,
      // JSON envelop
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data set',
    });
  }

  // create a new id
  // const newId = tours[tours.length - 1].id + 1;
  // // create new tour and adding it to tours
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // // write it to "database", sending a response to the client with the new created object (with ID)
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     }); // 201 means 'created'
  //   }
  // );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  // const tourToUpdate = tours.find((t) => t.id === req.params.id * 1);
  // const updatedFields = req.body;
  // Object.assign(tourToUpdate, updatedFields);
  // console.log(tours);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(200).json({
  //       status: 'success',
  //       data: { tour: tourToUpdate },
  //     });
  //   }
  // );
};

exports.deleteTour = async (req, res) => {
  // Here we delete the element from the tours array, but not from the file, so when restart the server no data has been really deleted
  //const newTours = tours.filter((t) => t.id !== req.params.id * 1);

  try {
    // const query = await Tour.deleteOne({ _id: req.params.id }); OR, IN A BETTER WAY...
    const query = await Tour.findByIdAndDelete(req.params.id);
    // query contains the deleted object, but usually it's not set back to the client
    // the 204 status code indeed is for a response with no body.
    res.status(204).json({
      status: 'success',
      data: { query },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
