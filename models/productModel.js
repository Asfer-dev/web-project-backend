const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is needed"],
    },
    price: {
      type: Number,
      required: [true, "Product price is needed"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      required: [true, "Atleast 1 product image is required"],
    },
    properties: {
      type: [
        {
          name: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
