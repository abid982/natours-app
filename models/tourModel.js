const mongoose = require('mongoose');
const slugify = require('slugify');

// We pass in not only the object with the schema definition itself but also an object for the schema options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
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
      required: [true, 'A string mush have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
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

// DOCUMENT MIDDLEWARE: It runs before save() and create() and not on insertMany() it's not triggered the save middleware
// It's going to run before an actual event and that event in this case is the save event
// Pass callback function and this callback function is going to run before an acutal document is saved to the database.

// Create a new document using our API in order to trigger this document middleware
// Call next middleware
tourSchema.pre('save', function (next) {
  console.log('Document pre middleware:');
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
  console.log(this);
  // Define a new property on currently processed document
  // Note: Define slug in Schema first otherwise it's not going to be persisted in the database.
  this.slug = slugify(this.name, { lower: true });

  next();
});

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
