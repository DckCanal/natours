const fs = require('fs');
const express = require('express');
// const { json } = require('express');

const app = express();
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

// Starting server...
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
