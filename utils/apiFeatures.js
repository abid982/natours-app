class APIFeatures {
  // Pass mongoose query and queryString
  // Reusable code
  // The query for tours, users and reviews etc
  // First parameter: Mongoose Query
  // Second Parameter: Query String gets access from req.query
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Methods
  filter() {
    // 1A) Filtering
    // Problem
    // const queryObj = req.query;
    // Create a shallow copy of an object
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach(el => delete queryObj[el]);

    // console.log('Request query:');
    // console.log(req.query, queryObj);
    let queryStr = JSON.stringify(queryObj);

    // console.log('Query string before:');
    // console.log(queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // console.log('Query string after:');
    // console.log(queryStr);

    // console.log('this query:');
    // console.log(this.query);

    // EXECUTE QUERY
    // const query = Tour.find(queryObj);
    // let query = Tour.find(JSON.parse(queryStr));
    // query.sort().select().skip().limit()

    // const testTour = await Tour.find({
    //   name: 'The Wine Taster',
    // });
    // console.log('Test tour:');
    // console.log(testTour);
    // let query = Tour.find(JSON.parse(queryStr));
    // Add this find to the query that we already have
    // this.query = this.query.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting
    // 127.0.01:8000/api/v1/tours?sort=price
    // 127.0.01:8000/api/v1/tours?sort=-price

    // console.log('Query string sort:');
    // console.log(this.queryString);

    if (this.queryString.sort) {
      // Chain operations
      // Sort query
      // query = query.sort(this.queryString.sort);
      // sort('price ratingsAverage');
      // 127.0.01:8000/api/v1/tours?sort=price,-ratingsAverage

      const sortBy = this.queryString.sort.split(',').join(' ');

      // console.log('Sort by:');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      // Newest tour appears first
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3) Limiting fields
    // 127.0.01:8000/api/v1/tours?fields=name,duraction,difficulty,price
    if (this.queryString.fields) {
      // console.log('Request query fields:');
      // console.log(this.queryString.fields);
      // { fields: 'name,duraction,difficulty,price' }

      const fields = this.queryString.fields.split(',').join(' ');
      // Selecting only certain field names is called projecting.
      // query = query.select('name duration price difficulty');
      this.query = this.query.select(fields);
    } else {
      // Default if user doesn't specify something
      // Minus means excluding
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // query = query.skip(10).limit(10);
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const numTours = await this.query.countDocuments();

    //   console.log('Number of tours in database:');
    //   console.log(numTours);
    //   console.log(skip);

    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    return this;
  }
}

module.exports = APIFeatures;
