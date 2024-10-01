const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let appointmentSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
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
    required: true,
    enum: ["Pending", "Confirmed", "Rejected", "Completed"],
    default: "Pending",
  },
  price: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
  },
});

let Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
