const express = require("express");
const router = express.Router();

//router.use("/user/", require("./users"));

router.use("/product/", require("./products"));

//router.use("/order/", require("./order"));

router.use("/review/", require("./reviews"));

module.exports = router;
