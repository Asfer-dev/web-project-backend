var express = require("express");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post(
  "/get-cart-products",
  asyncHandler(async function (req, res, next) {
    const products = await Product.find({ _id: req.body });
    res.json(products);
  })
);

module.exports = router;
