const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

// @desc    Get Products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select("name price images category")
    .lean();
  const categories = await Category.find().select("name");

  // replacing the category ids with category names in product objects
  const updatedProducts = products.map((product) => {
    if (product.category) {
      return {
        ...product,
        category: categories.find(
          (cat) => cat._id.toString() === product.category.toString()
        )?.name,
      };
    }
    return product;
  });
  res.status(200).json(updatedProducts);
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
  if (product.category) {
    const category = await Category.findById(product.category).select(
      "name description"
    );
    // product.category = category;
    const updatedProduct = { ...product._doc, category: category };
    res.status(200).json(updatedProduct);
    return;
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
  if (req.body.category === "") req.body.category = null;
  try {
    const product = await Product.create(req.body);

    // add the property values in this product's category for future ease while adding more products in same category
    const category = await Category.findById(product.category);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    // Update category properties
    category.properties = category.properties.map((prop) => {
      const matchingProductProp = product.properties.find(
        (p) => p.name === prop.name
      );

      if (matchingProductProp) {
        return {
          ...prop,
          values: [...new Set([...prop.values, matchingProductProp.value])],
        };
      }

      return prop;
    });
    await category.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Error while creating product:", error);
    res.status(500);
    throw new Error(
      error.message || "An error occurred while creating the product"
    );
  }
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

  product.name = req.body.name;
  product.properties = req.body.properties;
  product.category = req.body.category;
  if (req.body.category === "") product.category = null;
  product.use_category_description = req.body.use_category_description;
  console.log(product.use_category_description);
  product.description = req.body.description;
  product.price = req.body.price;
  product.images = req.body.images;
  await product.save();

  res.status(200).json("ok");
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
