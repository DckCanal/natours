const fs = require('fs');


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
  );

exports.getAllTours = (req, res) => {
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
  exports.getTour = (req, res) => {
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
  
  exports.createTour = (req, res) => {
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
  
  exports.updateTour = (req, res) => {
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
  
  exports.deleteTour = (req, res) => {
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