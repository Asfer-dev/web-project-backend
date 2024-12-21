var express = require("express");
const {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
var router = express.Router();

router.route("/").get(getProducts).post(authenticate, adminOnly, setProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(authenticate, adminOnly, updateProduct)
  .delete(authenticate, adminOnly, deleteProduct);

module.exports = router;
