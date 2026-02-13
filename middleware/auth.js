const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Not authenticated" });
  next();
};

//USERS
//Authorization by kind of user or ID

const authorizeUserAccess = (req, res, next) => {
  //if the user is auth.
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const loggedUser = req.user;
  const requestedUserId = req.params.userId;

  // employee or administrator = full access (I'm not sure is we need to created the "adm", but in werever case...)
  if (
    loggedUser.role === "employee" ||
    loggedUser.role === "administrator"
  ) {
    return next();
  }

  // customer or subscription = only their own ID
  if (
    (
      loggedUser.role === "customer" ||
      loggedUser.role === "subscription"
    ) &&
    loggedUser._id.toString() === requestedUserId
  ) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};



//ORDERS
const Order = require("../models/orders").ordersModel;

const authorizeOrderAccess = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const loggedUser = req.user;

  // employee o administrator = acceso total
  if (
    loggedUser.role === "employee" ||
    loggedUser.role === "administrator"
  ) {
    return next();
  }

  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // customerId (String) = userID
    if (order.customerId !== loggedUser._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  requireAuth,
  authorizeUserAccess,
  authorizeOrderAccess
};
