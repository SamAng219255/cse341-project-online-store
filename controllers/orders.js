const ordersModel = require("../models/orders");
const { DBNotReadyError, InvalidDataError, NotFoundError } = require("../error_types");

const getSingleOrder = async (req, res) => {
  let data;
  try {
    if (!req.params.orderId) throw new InvalidDataError();
    data = await ordersModel.getSingleOrder(req.params.orderId);
  }
  /*
    #swagger.responses[200] = {
      description: 'Order found and returned.',
      schema: {
        id: "000000000000000000000000",
        itemIds: ["000000000000000000000001", "000000000000000000000002"],
        customerId: "0000000000000000000000AA",
        productCount: 2,
        orderDate: "2026-02-04T00:00:00.000Z"
      }
    }
    #swagger.responses[400] = { description: 'Invalid order id.' }
    #swagger.responses[404] = { description: 'Order not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested order not found." });

    console.error(`getSingleOrder: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const getAllOrders = async (req, res) => {
  let data;
  try {
    const loggedUser = req.user;

    // Admin o employee = ALL
    if (
      loggedUser.role === "employee" ||
      loggedUser.role === "administrator"
    ) {
      data = await ordersModel.getAllOrders();
    }
    // Customer o subscription = only their orders
    else {
      data = await ordersModel.ordersModel.find({
        customerId: loggedUser._id.toString()
      });
    }
  }
  /*
    #swagger.responses[200] = {
      description: 'Returns a list of all orders.',
      schema: [{
        id: "000000000000000000000000",
        itemIds: ["000000000000000000000001"],
        customerId: "0000000000000000000000AA",
        productCount: 1,
        orderDate: "2026-02-04T00:00:00.000Z"
      }]
    }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });

    console.error(`getAllOrders: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const createOrder = async (req, res) => {
  /*
    #swagger.parameters['New Order Information'] = {
      in: 'body',
      description: 'New order record.',
      required: true,
      schema: {
      $itemIds: ["000000000000000000000001", "000000000000000000000002"],
      $productCount: 2,
      $orderDate: "2026-02-04T00:00:00.000Z"
        }
      }
    }
  */
  let id;
  try {
  const orderData = { ...req.body };

  orderData.customerId = req.user._id.toString();

  id = await ordersModel.createOrder(orderData);
}
  /*
    #swagger.responses[201] = {
      description: 'Order successfully created.',
      schema: { id: "000000000000000000000000" }
    }
    #swagger.responses[400] = { description: 'Invalid order data.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err.name === "ValidationError")
      return res.status(400).json(err);

    console.error(`createOrder: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(201).json({ id });
};

const updateOrder = async (req, res) => {
  /*
    #swagger.parameters['Updated Order Information'] = {
      in: 'body',
      description: 'Updated order record.',
      required: true,
      schema: {
        $itemIds: ["000000000000000000000003"],
        $customerId: "0000000000000000000000AA",
        $productCount: 1,
        $orderDate: "2026-02-05T00:00:00.000Z"
      }
    }
  */
  let data;
  try {
    if (!req.params.orderId) throw new InvalidDataError();
    const updateData = { ...req.body };//clone of body
    delete updateData.customerId;//delete customerID if someone try to send
    data = await ordersModel.updateOrder(req.params.orderId, updateData);
  }
  /*
    #swagger.responses[200] = {
      description: 'Order found and updated.',
      schema: {
        id: "000000000000000000000000",
        itemIds: ["000000000000000000000003"],
        customerId: "0000000000000000000000AA",
        productCount: 1,
        orderDate: "2026-02-05T00:00:00.000Z"
      }
    }
    #swagger.responses[400] = { description: 'Invalid order id or body.' }
    #swagger.responses[404] = { description: 'Order not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested order not found." });
    if (err.name === "ValidationError")
      return res.status(400).json(err);

    console.error(`updateOrder: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const deleteOrder = async (req, res) => {
  try {
    if (!req.params.orderId) throw new InvalidDataError();
    await ordersModel.deleteOrder(req.params.orderId);
  }
  /*
    #swagger.responses[204] = { description: 'Order found and deleted.' }
    #swagger.responses[400] = { description: 'Invalid order id.' }
    #swagger.responses[404] = { description: 'Order not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested order not found." });

    console.error(`deleteOrder: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.sendStatus(204);
};

module.exports = {
  getSingleOrder,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder
};
