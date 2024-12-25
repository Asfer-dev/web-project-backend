var express = require("express");
const {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controllers/categoryController");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
var router = express.Router();

router.route("/").get(getCategories).post(authenticate, adminOnly, setCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(authenticate, adminOnly, updateCategory)
  .delete(authenticate, adminOnly, deleteCategory);

module.exports = router;
