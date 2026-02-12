const ordersModel = require("../models/orders");
const { DBNotReadyError, InvalidDataError, NotFoundError } = require("../error_types");

const getSingleOrder = async (req, res) => {
  let data;
  try {
    if (!req.params.orderId) throw new InvalidDataError();
    data = await ordersModel.getSingleOrder(req.params.orderId);
  } catch (err) {
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
    data = await ordersModel.getAllOrders();
  } catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });

    console.error(`getAllOrders: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const createOrder = async (req, res) => {
  let id;
  try {
    const orderData = {
      ...req.body,
      customerId: req.user.id   // token, no from body
    };

    id = await ordersModel.createOrder(orderData);
  } catch (err) {
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
  let data;
  try {
    if (!req.params.orderId) throw new InvalidDataError();

    const { customerId, ...cleanBody } = req.body; //to ignore customerId

    data = await ordersModel.updateOrder(req.params.orderId, cleanBody);
  } catch (err) {
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
  } catch (err) {
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
