const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let contactSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Closed"],
    default: "New",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  interactions: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      action: {
        type: String,
        enum: ["Viewed", "Responded", "Archived"],
        required: true,
      },
      notes: {
        type: String,
      },
    },
  ],
});

let Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
