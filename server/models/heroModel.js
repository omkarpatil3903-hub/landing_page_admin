const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Hero = mongoose.model("Hero", heroSchema, "hero");
module.exports = Hero;
