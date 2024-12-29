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
const User = require("../models/userModel");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");

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

const deleteFile = (fileLocation) => {
  const filePath = path.join(
    __dirname.split("routes")[0],
    "public",
    fileLocation
  );

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File ${fileLocation} deleted successfully`);
    }
  });
};

async function addUploadedImagesToImagesArray(req, res, next) {
  try {
    // add the uploaded files' paths to images array
    if (req.body.images) req.body.images = JSON.parse(req.body.images);
    else req.body.images = [];
    const images = req.files.map((file) => file.path.split("public")[1]);
    req.body.images = [...req.body.images, ...images];

    // parse properties in json format
    req.body.properties = JSON.parse(req.body.properties);
    next();
  } catch (error) {
    res.status(500);
    throw new Error(
      error.message || "An error occurred while creating the product"
    );
  }
}

async function deleteRemovedImages(req, res, next) {
  try {
    // delete the removed image files if any
    const product = await Product.findById(req.body.id);
    const removedImages = product.images.filter(
      (image) => !req.body.images.includes(image)
    );
    removedImages.forEach((imagePath) => deleteFile(imagePath));
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
    deleteRemovedImages,
    updateProduct
  )
  .delete(authenticate, adminOnly, deleteProduct);

module.exports = router;
