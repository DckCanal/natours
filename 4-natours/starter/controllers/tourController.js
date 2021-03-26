const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
  // console.log(`CheckID run! ${val}`);
  const tour = tours.find((t) => t.id === req.params.id * 1);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing tour name',
    });
  }
  if (!req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing tour price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  // send all the data about the tours
  // JSEND standard
  res.status(200).json({
    status: 'success',
    results: tours.length,
    receivedAt: req.requestTime,
    // JSON envelop
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const tour = tours.find((t) => t.id === req.params.id * 1);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // create a new id
  const newId = tours[tours.length - 1].id + 1;

  // create new tour and adding it to tours
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  // write it to "database", sending a response to the client with the new created object (with ID)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      }); // 201 means 'created'
    }
  );
};

exports.updateTour = (req, res) => {
  const tourToUpdate = tours.find((t) => t.id === req.params.id * 1);
  const updatedFields = req.body;
  Object.assign(tourToUpdate, updatedFields);
  console.log(tours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: { tour: tourToUpdate },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  // Here we delete the element from the tours array, but not from the file, so when restart the server no data has been really deleted
  const newTours = tours.filter((t) => t.id !== req.params.id * 1);
  console.log(newTours);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
