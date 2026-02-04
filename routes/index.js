const express = require("express");
const router = express.Router();

//router.use("/user/", require("./user"));

router.use("/product/", require("./product"));

//router.use("/order/", require("./order"));

//router.use("/review/", require("./review"));

module.exports = router;
