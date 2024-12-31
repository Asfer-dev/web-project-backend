var express = require("express");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
var router = express.Router();
const { authenticate, adminOnly } = require("../middleware/authMiddleware");

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

router.get(
  "/dashboard",
  authenticate,
  adminOnly,
  asyncHandler(async function (req, res) {
    // First aggregation query
    const totalSalesResult = await Order.aggregate([
      { $unwind: "$line_items" },
      {
        $lookup: {
          from: "products", // The name of the Product collection
          localField: "line_items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $multiply: ["$line_items.quantity", "$productDetails.price"],
            },
          },
        },
      },
    ]);

    const totalSales = totalSalesResult[0]?.totalSales || 0;

    // Second aggregation query
    const productCountByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          Products: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 0,
          category: "$categoryDetails.name",
          Products: 1,
        },
      },
    ]);

    res.status(200).json({
      totalSales,
      productCountByCategory,
    });
  })
);

module.exports = router;
