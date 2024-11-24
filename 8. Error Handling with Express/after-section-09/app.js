const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// if we reach this point of the file, it means an undefined path has been entered
// app.all covers all types of requests on invalid routes
app.all('*', (req, res, next) => {
  // if an argumemnt is passed into next() anytime, express automatically assumes there has been an error and will skip all other middleware functions and go to the global error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling middleware has 4 args instead of the normal 3. so express automatically identifies as it as error handling middleware and will only call it when there is an error.
app.use(globalErrorHandler); 

module.exports = app;
