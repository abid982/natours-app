const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// const User = require('./userModel');

// We pass in not only the object with the schema definition itself but also an object for the schema options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must less or equal than 40 characters'],
      minlength: [10, 'A tour name must more or equal than 10 characters'],
      // validate: [validator.isAplha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // The difficulty is either easy, medium or difficult and this validator is only for strings.
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // THE this KEYWORD ONLY POINTS TO THE CURRENNT DOCUMENT ON NEW DOCUMENT CREATION
          return val < this.price;
        },
        message: `Dicount price ({VALUE}) should be below the regular price`,
      },
      // validate: function (val) {
      //   // Retrun either true or valse
      //   return val < this.price; // 100 < 150
      // },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    // Note: MongoDB uses a special data format called GeoJSON in order to specify Geospatial Data
    // Now how does actually this work? This object that we specified here is actually this time not for the Schema Type Options but this object is now an embedded object.
    // We need type and coordinated properties
    //     location: {
    //       type: "Point",
    //       coordinates: [-73.856077, 40.848447]
    // }
    // It describes certain point location on earth
    startLocation: {
      type: {
        type: String,
        default: 'Point', // Polygons, Lines
        enum: ['Point'],
      },
      // It expect an array of numbers
      coordinates: [Number], // [-73.856077, 40.848447]
      address: String,
      description: String,
    },

    // To create new documents and then embed them into another document we need to create an array.
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // Embed user documents
    // guides: Array,

    // Child referencing: An array full of ids
    guides: [
      {
        // The type of this is MongoDB Id
        // We also need to specify the reference and this is where the magic happens behind the scenes and this is really how we establish references between different datasets in Mongoose and for this we do not actually need to have the User to be imported into this document.
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // Child referencing so the tour referencing the reviews
    // Best Solution: Virtual Populate
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   },
    // ],
  },
  //   Each time that the data is actually outputted as json we want virtuals to be true so basically the virtual to be the part of the output.
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Define virtual properties on the Tour Schema tourSchema.virtual() and then pass the name of the virtual property and then on there we need to define the get method because this virtual property here will basically be created each time that we get some data out of the database so this get function here is called a getter
// Now in here we pass a function and actually this callback function is going to be a real function so not an arrow function because the arrow function does not get its own this keyword but we need the this keyword.
// The virtual property durationWeeks doen't persited in the database but it's only going to be there as soon as we get the data.
// We also need to explicitly define the virtual properties in our schema
tourSchema.virtual('durationWeeks').get(function () {
  // Define a virtual property
  // The this keywork points to the current document
  // Convert days to weeks
  return this.duration / 7;
});

// Virtual Populate
// So now with this setup we can actually populate
tourSchema.virtual('reviews', {
  // Name of the model that we want to reference
  ref: 'Review',
  // Now we actually need to specify the name of the fields in order to connect the two datasets
  // So here we need to specify the two fields the foreign field and the local field
  // The foriegnField: This is the name of the field in other model so in the review model in this case where the referece to the current model is stored
  foreignField: 'tour',
  // The reference of the current model
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: It runs before save() and create() and not on insertMany()

// It's going to run before an actual event and that event in this case is the save event
// Pass callback function and this callback function is going to run before an acutal document is saved to the database.

// Create a new document using our API in order to trigger this document middleware
// Call next middleware
tourSchema.pre('save', function (next) {
  // console.log('Document pre middleware:');
  // Currently processed document that is being saved
  // This is what our document is looking like right before it's saved into the database
  /*
    Document middleware:
{
  name: 'Test Tour',
  duration: 1,
  maxGroupSize: 1,
  difficulty: 'difficult',
  ratingsAverage: 4.5,
  ratingsQuantity: 0,
  price: 1,
  summary: 'Test tour',
  imageCover: 'tour-7-cover.jpg',
  images: [],
  createdAt: 2023-09-27T08:36:54.611Z,
  startDates: [],
  _id: new ObjectId("6513e9f7d606616218af3cf3"),
  durationWeeks: 0.14285714285714285,
  id: '6513e9f7d606616218af3cf3'
}

At this point we still act on the data before it then saved to the database and that's exactly what we're going to do now. What we want to do here is to create a slug for each of these documents.
Install slugify package
  */
  // console.log(this);
  // Define a new property on currently processed document
  // Note: Define slug in Schema first otherwise it's not going to be persisted in the database.
  this.slug = slugify(this.name, { lower: true });

  next();
});

// It is responsible for embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// // We can create multiple pre middleware
// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');

//   next();
// });

// // Let's now just very quickly experiment also with a post middleware
// // The post middleware as access not only to next but also to the document that was just saved to the database
// // Middleware or Hook | Post Save Hook
// tourSchema.post('save', function (document, next) {
//   // We don't access to the this keyword but the finished document
//   console.log('Document post middleware:');
//   console.log(document);
//   next();
// });

// 2) QUERY MIDDLEWARE
// We see that it looks exactly like the other middleware the other pre-hook. The only difference here is really this find hook which will make this query middleware and not document middleware.
// The big difference here is that this keyword will now point at the current query and not at the current document because we're really processing a query.
// We can have secret tours in our database like for tours that are only offered internally of for a very small vip group of people and the public shouldn't know about. Now since these tours are secret so we do not want the secret tours to ever appear in the result output.
// What we're gonna to do is to create a secret tour field then query only for tours that are not secret.
// Keep in mind that this point to a query object and so we can chain all of the methods that we have for queries and so let's simply add a find method and then basically select all the documents where the secret tour is not true
// What happens is that we create a query using tour dot find and then of course we chain all these methods to it and then by the end we then execute that query here by using await so this is where we execute a query but before it actually is executed then our pre find middleware here is executed and it is executed because it is find query and filter our tours.
// Rememeber that this middleware is running for find but not for findOne.
// Let's take the id for the secret tour
// 127.0.01:8000/api/v1/tours/651941395aa5d1bb8adff0ac
// findById means findOne
// this points to the query object
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });

//   next();
// });

// There are two methods
// 1) Use findOne pre hook
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });
// 2) Use Regular Expression
// This middleware is going to run not only find but for all the commands that start with the name find
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();

  next();
});

// The function runs each time where there is a query
// Remember that in the query middleware this always points to the current query
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -role',
  });

  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   // console.log('Docs:');
//   // console.log(docs);
//   // console.log('this post find hook:');
//   // console.log(this);

//   // console.log(`Query took ${Date.now() - this.start} milliseconds...`);
//   next();
// });

// Result: We're going to use a lot throughout the course because middleware is really a fundamental concept that's really important for a lot of stuff that we need in out applications.

// AGGREGATION MIDDLEWARE
// Note: The this object points to the current aggregation object
// It's not a problem to repeat stages in aggregation pipeline.
tourSchema.pre('aggregate', function (next) {
  // console.log('Aggregation this:');
  // console.log(this);
  // console.log(this._pipeline);
  // console.log('Aggregation pineline method:');
  // console.log(this.pipeline());

  // Add stage right at the beginning of an array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  /*
    Aggregate {
  _pipeline: [
    { '$match': [Object] },
    { '$group': [Object] },
    { '$sort': [Object] }
  ],
  _model: Model { Tour },
  options: {}
}

We have an array of all the stages
[
  { '$match': { ratingsAverage: [Object] } },
  {
    '$group': {
      _id: [Object],
      numTours: [Object],
      numRatings: [Object],
      avgRating: [Object],
      avgPrice: [Object],
      minPrice: [Object],
      maxPrice: [Object]
    }
  },
  { '$sort': { avgPrice: -1 } }
]

[
  { '$match': { ratingsAverage: [Object] } },
  {
    '$group': {
      _id: [Object],
      numTours: [Object],
      numRatings: [Object],
      avgRating: [Object],
      avgPrice: [Object],
      minPrice: [Object],
      maxPrice: [Object]
    }
  },
  { '$sort': { avgPrice: -1 } }
]
  */

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

// Save testTour document to the database
// Now this save method will return a promise that we can then consume
// testTour.save().then(document => {
//     console.log('Document:');
//     console.log(document);
// }).catch(err => {
//     console.log('Error:', err);
// });

module.exports = Tour;
