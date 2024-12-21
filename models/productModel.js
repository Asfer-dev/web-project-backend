const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is needed"],
  },
  price: {
    type: Number,
    required: [true, "Product price is needed"],
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: [true, "Atleast 1 product image is required"],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
