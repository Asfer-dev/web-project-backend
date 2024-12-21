var express = require("express");
const {
  getCategories,
  setCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
var router = express.Router();

router.route("/").get(getCategories).post(setCategory);

router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
