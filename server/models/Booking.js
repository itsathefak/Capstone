const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let bookingSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    price: {
        type: Number,
        required: true
    },
    comments: {
        type: String
    }
});

let Booking = new mongoose.model('Booking', bookingSchema);
module.exports = Booking