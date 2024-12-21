var express = require("express");
const {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");
var router = express.Router();

router.route("/").get(getProducts).post(setProduct);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
