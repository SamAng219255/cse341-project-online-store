const router = require("express").Router();
const ordersController = require("../controllers/orders");
const { requireAuth, authorizeOrderAccess } = require("../middleware/auth");

router.get("/", requireAuth, ordersController.getAllOrders);

router.get("/:orderId", requireAuth, authorizeOrderAccess, ordersController.getSingleOrder);

router.post("/", requireAuth, ordersController.createOrder);

router.put("/:orderId", requireAuth, authorizeOrderAccess, ordersController.updateOrder);

router.delete("/:orderId", requireAuth, authorizeOrderAccess, ordersController.deleteOrder)

module.exports = router;
