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

// Serving static files
app.use(express.static(`${__dirname}/public`));
// Adding myown middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware!');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) SERVER
// Starting server...
module.exports = app;
