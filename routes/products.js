const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const reqAuthorize = require("../middleware/reqAuthorize");

router.get(
	"/",
	productsController.getAllProducts
);

router.post(
	"/",
	reqAuthorize({accountTypeMatches: "employee"}),
	productsController.createProduct
);

router.get(
	"/:productId",
	reqAuthorize({accountTypeMatches: "employee"}),
	productsController.getProductById
);

router.put(
	"/:productId",
	reqAuthorize({accountTypeMatches: "employee"}),
	productsController.updateProduct
);

router.delete(
	"/:productId",
	reqAuthorize({accountTypeMatches: "employee"}),
	productsController.deleteProduct
);

module.exports = router;