const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // removes white space from beginning and end of string
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price; // this only points to current doc on NEW document creation and not on update
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String], // array of Strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // excluding field in schema itself
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true }, // to specify that we want virtual properties in our output
    toObject: { virtuals: true }
  }
);

// virtual properties are not stored in DB
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7; // arrow function does not get 'this'
});

// DOCUMENT MIDDLEWARE: runs before or after .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true }); // 'this' points at document
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// run before or after a find query is executed
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } }); // 'this' points at query

  this.start = Date.now();
  next();
});

// post query middleware function has access to the document as well
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE: run before or after an aggregation query is executed
tourSchema.pre('aggregate', function(next) {
  console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // adding match to the begining of array
  next();
});

const Tour = mongoose.model('Tour', tourSchema); // Tour model

module.exports = Tour;
