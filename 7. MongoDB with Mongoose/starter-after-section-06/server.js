const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// console.log(process.env); variables set in config.env are available as process environment variables and can be accessed throughout the process in every single file

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    // con =>
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
});

testTour
  .save()
  .then(doc => console.log('saved: ', doc))
  .catch(err => console.log('error in saving:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
