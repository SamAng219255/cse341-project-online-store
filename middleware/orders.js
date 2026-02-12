const ordersModel = require("../models/orders");

const requireOwnOrder = async (req, res, next) => {
  try {
    const order = await ordersModel.getSingleOrder(req.params.orderId);

    // Employee puede todo
    if (req.user.accountType === "employee") {
      return next();
    }

    // Customer / Subscription → solo si es suya
    if (order.customerId !== req.user.id) {
      return res.status(403).json({
        message: "You can only access your own orders"
      });
    }

    next();
  } catch (err) {
    return res.status(404).json({ message: "Order not found" });
  }
};

module.exports = { requireOwnOrder };
