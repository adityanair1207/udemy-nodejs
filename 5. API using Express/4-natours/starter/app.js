const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

const port = 3000;

app.use(express.json()); // express.json() is middleware. required to add body data to request object.

// Middlewares
app.use(morgan('dev')); // middleware to console log our requests

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*
// GET method on root URL
app.get('/', (req, res) => {
  //   res.status(200).send('<h1>Hello from the server!<h1/>');
  res.status(200).json({ message: 'Hello from the server!', app: 'Natours' }); // response content type set to app/json
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
*/

// only done once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// console.log('tours', tours);

// Route handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime); // added by our own middleware

  // sending in JSend specification
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  //   console.log('req.params', req.params);
  const id = req.params.id * 1; // to convert string to number

  const tour = tours.find((tour) => tour.id === id);

  //   if (id > tours.length) { OR
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  //   console.log('req.body', req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: { tour: newTour },
      });
    }
  );
};

const updateTour = (req, res) => {};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.get('/api/v1/tours', getAllTours);

// /api/v1/tours/:param1/:param2/:optionalParam3?
// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// Refactored routing
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// Start server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
