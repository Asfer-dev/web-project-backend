const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Get Products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// @desc    Get a single Product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

// @desc    Add a Product
// @route   POST /api/products
// @access  Private
const setProduct = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("product name field is required");
  }
  if (!req.body.price) {
    res.status(400);
    throw new Error("product price field is required");
  }
  if (!req.body.images || req.body.images.length < 1) {
    res.status(400);
    throw new Error("Atleast 1 product image is required");
  }
  const product = await Product.create(req.body);

  res.status(200).json(product);
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }

  if (!req.body.name) {
    res.status(400);
    throw new Error("product name field is required");
  }
  if (!req.body.price) {
    res.status(400);
    throw new Error("product price field is required");
  }
  if (!req.body.images || req.body.images.length < 1) {
    res.status(400);
    throw new Error("Atleast 1 product image is required");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.status(200).json(updatedProduct);
});

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400);
    throw new Error("Product not found");
  }
  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getProducts,
  getProduct,
  setProduct,
  updateProduct,
  deleteProduct,
};
