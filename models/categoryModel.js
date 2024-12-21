const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is needed"],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    properties: {
      type: [
        {
          name: { type: String, required: true },
          values: { type: [String], default: [] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
