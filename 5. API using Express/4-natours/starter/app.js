const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // express.json() is middleware. required to add body data to request object.

const port = 3000;

/*
// GET method on root URL
app.get('/', (req, res) => {
  //   res.status(200).send('<h1>Hello from the server!<h1/>');
  res.status(200).json({ message: 'Hello from the server!', app: 'Natours' }); // response content type set to app/json
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
*/

// only done once
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// console.log('tours', tours);

app.get('/api/v1/tours', (req, res) => {
  // sending in JSend specification
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// /api/v1/tours/:param1/:param2/:optionalParam3?
app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {});

app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
