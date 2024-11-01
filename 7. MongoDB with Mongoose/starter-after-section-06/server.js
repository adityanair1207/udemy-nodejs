const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// console.log(process.env); variables set in config.env are available as process environment variables and can be accessed throughout the process in every single file

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
