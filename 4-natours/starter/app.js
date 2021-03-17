const fs = require('fs');
const express = require('express');
// const { json } = require('express');

const app = express();

// Adding json middleware for access body of request
app.use(express.json());
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

app.get('/api/v1/tours', (req, res) => {
  // send all the data about the tours

  // JSEND standard
  res.status(200).json({
    status: 'success',
    results: tours.length,
    // JSON envelop
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params);
  const tour = tours.find((t) => t.id === req.params.id * 1);
  // console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

// Starting server...
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
