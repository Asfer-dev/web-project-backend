var express = require("express");
const multer = require("multer");
const {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");
const { authenticate, adminOnly } = require("../middleware/authMiddleware");
var router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/product-images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

function addUploadedImagesToImagesArray(req, res, next) {
  try {
    if (req.body.images) req.body.images = JSON.parse(req.body.images);
    else req.body.images = [];
    const images = req.files.map((file) => file.path.split("public")[1]);
    req.body.images = [...req.body.images, ...images];

    req.body.properties = JSON.parse(req.body.properties);
    next();
  } catch (error) {
    res.status(500);
    throw new Error(
      error.message || "An error occurred while creating the product"
    );
  }
}

router
  .route("/")
  .get(getProducts)
  .post(
    authenticate,
    adminOnly,
    upload.array("imageFiles"),
    addUploadedImagesToImagesArray,
    setProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .put(
    authenticate,
    adminOnly,
    upload.array("imageFiles"),
    addUploadedImagesToImagesArray,
    updateProduct
  )
  .delete(authenticate, adminOnly, deleteProduct);

module.exports = router;
