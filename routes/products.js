const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");

router.get("/", productsController.getAllProducts);

router.post("/", productsController.createProduct);

router.get("/:productId", productsController.getProductById);

router.put("/:productId", productsController.updateProduct);

router.delete("/:productId", productsController.deleteProduct);

module.exports = router;