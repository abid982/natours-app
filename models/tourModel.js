const mongoose = require('mongoose');

// We pass in not only the object with the schema definition itself but also an object for the schema options
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
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
  }
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
