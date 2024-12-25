const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    line_items: { type: Array, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    postal: { type: String },
    address: { type: String, required: true },
    country: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
