var express = require("express");
const {
  getOrders,
  setOrder,
  updateOrder,
} = require("../controllers/orderController");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
var router = express.Router();

router.route("/").get(getOrders).post(authenticate, adminOnly, setOrder);

router.route("/:id").put(authenticate, adminOnly, updateOrder);
// .delete(authenticate, adminOnly, deleteOrder);

module.exports = router;
