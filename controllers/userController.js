const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register new User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all user fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(`User with email:${email} already exists`);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._doc._id,
      role: user._doc.role,
      email: user._doc.email,
      name: user._doc.name,
      token: generateToken(user._doc._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a User
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select("name email role password")
    .lean();

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get User data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// @desc    Update User data
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name;
  user.email = req.body.email;
  const updatedUser = await user.save();
  res.status(200).json(updatedUser);
});

// @desc    Get User cart
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user.cart);
});

// @desc    Update User cart
// @route   POST /api/users/cart
// @access  Private
const setCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  if (!cart) {
    res.status(400);
    throw new Error("no cart provided");
  }
  const user = await User.findById(req.user._id);
  user.cart = cart;
  await user.save();

  res.json({ message: "cart updated" });
});

// @desc    Get User Wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user.wishlist);
});

// @desc    Update User Wishlist
// @route   POST /api/users/wishlist
// @access  Private
const setWishlist = asyncHandler(async (req, res) => {
  const { wishlist } = req.body;
  if (!wishlist) {
    res.status(400);
    throw new Error("no wishlist provided");
  }
  const user = await User.findById(req.user._id);
  user.wishlist = wishlist;
  await user.save();

  res.json({ message: "wishlist updated" });
});

// @desc    Get User Orders
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("placed_orders");

  res.json(user.placed_orders);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  setCart,
  getCart,
  getWishlist,
  setWishlist,
  getUserOrders,
};
