var express = require("express");
const {
  registerUser,
  getMe,
  loginUser,
  setCart,
  getCart,
  getWishlist,
  setWishlist,
} = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
var router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getMe);
router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, setCart);
router.get("/wishlist", authenticate, getWishlist);
router.post("/wishlist", authenticate, setWishlist);

module.exports = router;
