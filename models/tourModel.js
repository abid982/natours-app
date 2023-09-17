const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a number'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
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
