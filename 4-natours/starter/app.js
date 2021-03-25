const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const { json } = require('express');
const { isNull } = require('util');
// const { json } = require('express');

const app = express();

// 1) MIDDLEWARES

// Adding json middleware for access body of request
app.use(express.json());
app.use(morgan('dev'));
// Adding myown middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

// Routing
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'natours' });
// });

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  // send all the data about the tours
  console.log(req.requestTime);
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
const getTour = (req, res) => {
  // console.log(req.params);
  const tour = tours.find((t) => t.id === req.params.id * 1);
  // console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //console.log(req.body);

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

const updateTour = (req, res) => {
  const updatedFields = req.body;
  const tourToUpdate = tours.find((t) => t.id === req.params.id * 1);
  if (!tours) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
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

const deleteTour = (req, res) => {
  // Here we delete the element from the tours array, but not from the file, so when restart the server no data has been really deleted
  if (tours.every((t) => t.id !== req.params.id * 1)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const newTours = tours.filter((t) => t.id !== req.params.id * 1);
  console.log(newTours);
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const notImplResponse = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Resource not yet implemented',
  });
};

const getAllUsers = (req, res) => {
  notImplResponse(req, res);
};
const getUser = (req, res) => {
  notImplResponse(req, res);
};
const createUser = (req, res) => {
  notImplResponse(req, res);
};
const updateUser = (req, res) => {
  notImplResponse(req, res);
};
const deleteUser = (req, res) => {
  notImplResponse(req, res);
};

// 3) ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER
// Starting server...
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
