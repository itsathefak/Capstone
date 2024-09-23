const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let serviceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    availability: {
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
            type: Boolean,
            required: true
        }
    }
});

let Service = new mongoose.model('Service', serviceSchema);
module.exports = Service