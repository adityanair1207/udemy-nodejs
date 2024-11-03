class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // done to create a new object
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // so as to not be passed as filter to DB
    excludedFields.forEach(el => delete queryObj[el]); // filtering

    // advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // adding $ to make them MongoDB operators

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // to sort by multiple fields
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // default sorting by createdAt descending
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // excluding __v field from DB
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // * 1 done to convert string to number
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
