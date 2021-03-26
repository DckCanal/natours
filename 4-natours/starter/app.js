const express = require('express');
const morgan = require('morgan');
const { json } = require('express');
const { isNull } = require('util');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
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


// Routing
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'natours' });
// });

// 2) ROUTE HANDLERS




// 3) ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);



// mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER
// Starting server...
module.exports = app;
