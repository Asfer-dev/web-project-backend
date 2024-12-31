const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = mongoose.Schema(
  {
    order_no: {
      type: Number,
      unique: true,
    },
    line_items: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: Number,
        },
      ],
      required: true,
    },
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

OrderSchema.plugin(AutoIncrement, { inc_field: "order_no" });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
