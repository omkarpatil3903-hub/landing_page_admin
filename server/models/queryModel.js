const mongoose = require("mongoose");
const Contact = require("./contactModel");

const queryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  query: {
    type: String,
  },
  status: {
    type: String,
  },
});

const querySchema = new mongoose.Schema({
  items: [queryItemSchema],
});

const Query = mongoose.model("Query", querySchema, "query");
module.exports = Query;
