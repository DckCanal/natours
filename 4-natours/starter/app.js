const express = require('express');

const app = express();

// Routing
app.get('/', (req, res) => {
  //   res.status(200).send('Hello from the server side!');
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'natours' });
});

// Starting server...
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
