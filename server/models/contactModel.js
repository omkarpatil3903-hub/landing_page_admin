const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  hours: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", contactSchema, "contact");
module.exports = Contact;
