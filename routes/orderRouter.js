var express = require("express");
const {
  getOrders,
  setOrder,
  updateOrder,
  getOrder,
} = require("../controllers/orderController");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
var router = express.Router();

router.route("/").get(getOrders).post(setOrder);

router.route("/:id").get(getOrder).put(authenticate, adminOnly, updateOrder);
// .delete(authenticate, adminOnly, deleteOrder);

module.exports = router;
