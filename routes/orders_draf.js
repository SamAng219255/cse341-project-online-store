const router = require("express").Router();
const ordersController = require("../controllers/orders");

const { requireAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const { requireOwnOrder } = require("../middleware/orders");

/*
=========================================
GET ALL ORDERS
Employee → puede ver todas
Customer / Subscription → solo las suyas
=========================================
*/
router.get(
  "/",
  requireAuth,
  requireRole("customer", "subscription", "employee"),
  ordersController.getAllOrders
);

/*
=========================================
GET SINGLE ORDER
Customer / Subscription → solo si es suya
Employee → cualquiera
=========================================
*/
router.get(
  "/:orderId",
  requireAuth,
  requireRole("customer", "subscription", "employee"),
  requireOwnOrder,
  ordersController.getSingleOrder
);

/*
=========================================
CREATE ORDER
Solo Customer y Subscription
=========================================
*/
router.post(
  "/",
  requireAuth,
  requireRole("customer", "subscription"),
  ordersController.createOrder
);

/*
=========================================
UPDATE ORDER
Solo Employee
=========================================
*/
router.put(
  "/:orderId",
  requireAuth,
  requireRole("employee"),
  ordersController.updateOrder
);

/*
=========================================
DELETE ORDER
Customer / Subscription → solo si es suya
Employee → cualquiera
=========================================
*/
router.delete(
  "/:orderId",
  requireAuth,
  requireRole("customer", "subscription", "employee"),
  requireOwnOrder,
  ordersController.deleteOrder
);

module.exports = router;
