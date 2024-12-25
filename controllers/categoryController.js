const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

// @desc    Get Categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

// @desc    Get a single Category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }
  res.status(200).json(category);
});

// @desc    Add a Category
// @route   POST /api/categories
// @access  Private
const setCategory = asyncHandler(async (req, res) => {
  if (!req.body.name) {
    res.status(400);
    throw new Error("Category name field is required");
  }
  const category = await Category.create(req.body);

  res.status(200).json(category);
});

// @desc    Update a Category
// @route   PUT /api/catetgories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  if (!req.body.name) {
    res.status(400);
    throw new Error("Category name field is required");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.status(200).json(updatedCategory);
});

// @desc    Delete a Category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }
  await Category.deleteOne({ _id: req.params.id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCategories,
  getCategory,
  setCategory,
  updateCategory,
  deleteCategory,
};
