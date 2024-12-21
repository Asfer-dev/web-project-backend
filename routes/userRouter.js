var express = require("express");
const {
  registerUser,
  getMe,
  loginUser,
  setCart,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getMe);
router.post("/cart", authenticate, setCart);

module.exports = router;
