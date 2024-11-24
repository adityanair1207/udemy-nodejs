class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // super calls the parent class (Error) constructor. This constructor only has message property.

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // all errors handled here are operational errors since programming errors cannot be predicted.

    Error.captureStackTrace(this, this.constructor); // the constructor function called will not appear in the stack trace
  }
}

module.exports = AppError;
