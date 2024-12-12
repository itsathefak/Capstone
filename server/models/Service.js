const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  providerFirstName: {
    type: String,
    required: true,
  },
  providerLastName: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  availability: [
    {
      date: {
        type: Date,
        required: true,
      },
      slots: [
        {
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            enum: ["Available", "Booked", "Unavailable"],
            default: "Available",
          },
        },
      ],
    },
  ],
});

let Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
