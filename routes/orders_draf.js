const router = require("express").Router();
const ordersController = require("../controllers/orders");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, ordersController.getAllOrders);
router.get("/:orderId", requireAuth, ordersController.getSingleOrder);
router.post("/", requireAuth, ordersController.createOrder);
router.put("/:orderId", requireAuth, ordersController.updateOrder);
router.delete("/:orderId", requireAuth, ordersController.deleteOrder);

module.exports = router;
