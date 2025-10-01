const mongoose = require("mongoose");

// This schema defines the structure for ONE SINGLE product document.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // ✅ This is the critical change:
    // It's named 'images' (plural) and it is an array of strings.
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// We now export this single product schema directly.
// The old structure with 'items' is no longer needed.
module.exports = mongoose.model("Product", productSchema);
