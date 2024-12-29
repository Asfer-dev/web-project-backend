const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

// @desc    Get Orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

// @desc    Add an Order
// @route   POST /api/orders
// @access  Public
const setOrder = asyncHandler(async (req, res) => {
  if (!req.body.line_items) {
    res.status(400);
    throw new Error("Product data field 'line_items' is required");
  }
  if (!req.body.name) {
    res.status(400);
    throw new Error("name field is required");
  }
  if (!req.body.email) {
    res.status(400);
    throw new Error("email field is required");
  }
  if (!req.body.address) {
    res.status(400);
    throw new Error("address field is required");
  }
  if (!req.body.country) {
    res.status(400);
    throw new Error("country field is required");
  }
  if (!req.body.city) {
    res.status(400);
    throw new Error("city field is required");
  }
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500);
    throw new Error(
      error.message || "An error occurred while creating the product"
    );
  }
});

// @desc    Update an Order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(400);
    throw new Error("Order not found");
  }

  if (!req.body.line_items) {
    res.status(400);
    throw new Error("Product data field 'line_items' is required");
  }
  if (!req.body.name) {
    res.status(400);
    throw new Error("name field is required");
  }
  if (!req.body.email) {
    res.status(400);
    throw new Error("email field is required");
  }
  if (!req.body.address) {
    res.status(400);
    throw new Error("address field is required");
  }
  if (!req.body.country) {
    res.status(400);
    throw new Error("country field is required");
  }
  if (!req.body.city) {
    res.status(400);
    throw new Error("city field is required");
  }

  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json(updatedOrder);
});

// // @desc    Delete a Category
// // @route   DELETE /api/categories/:id
// // @access  Private
// const deleteCategory = asyncHandler(async (req, res) => {
//   const category = await Category.findById(req.params.id);
//   if (!category) {
//     res.status(400);
//     throw new Error("Category not found");
//   }
//   await Category.deleteOne({ _id: req.params.id });

//   res.status(200).json({ id: req.params.id });
// });

module.exports = {
  getOrders,
  setOrder,
  updateOrder,
};
