const usersModel = require("../models/users");
const { DBNotReadyError, InvalidDataError, NotFoundError } = require("../error_types");

const getSingleUser = async (req, res) => {
  let data;
  try {
    if (!req.params.userId) throw new InvalidDataError();
    data = await usersModel.getSingleUser(req.params.userId);
  }
  /*
    #swagger.responses[200] = {
      description: 'User found and returned.',
      schema: {
        id: "000000000000000000000000",
        firstName: "Danae",
        lastName: "De la Cruz",
        oauth: { provider: "github", githubId: "123456" },
        email: "danae@example.com",
        address: "Rexburg, ID",
        accountType: "customer"
      }
    }
    #swagger.responses[400] = { description: 'Invalid user id.' }
    #swagger.responses[404] = { description: 'User not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested user not found." });

    console.error(`getSingleUser: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const getAllUsers = async (req, res) => {
  let data;
  try {
    data = await usersModel.getAllUsers();
  }
  /*
    #swagger.responses[200] = {
      description: 'Returns a list of all users.',
      schema: [{
        id: "000000000000000000000000",
        firstName: "Danae",
        lastName: "De la Cruz",
        oauth: { provider: "github", githubId: "123456" },
        email: "danae@example.com",
        address: "Rexburg, ID",
        accountType: "customer"
      }]
    }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });

    console.error(`getAllUsers: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const createUser = async (req, res) => {
  /*
    #swagger.parameters['New User Information'] = {
      in: 'body',
      description: 'New user record.',
      required: true,
      schema: {
        $firstName: "Danae",
        $lastName: "De la Cruz",
        $oauth: { provider: "github", githubId: "123456" },
        $email: "danae@example.com",
        $address: "Rexburg, ID",
        $accountType: "customer"
      }
    }
  */
  let id;
  try {
    id = await usersModel.createUser(req.body);
  }
  /*
    #swagger.responses[201] = {
      description: 'User successfully created.',
      schema: { id: "000000000000000000000000" }
    }
    #swagger.responses[400] = { description: 'Invalid user data.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err.name === "ValidationError")
      return res.status(400).json(err);

    console.error(`createUser: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(201).json({ id });
};

const updateUser = async (req, res) => {
  /*
    #swagger.parameters['Updated User Information'] = {
      in: 'body',
      description: 'Updated user record.',
      required: true,
      schema: {
        $firstName: "Danae",
        $lastName: "Gomez",
        $oauth: { provider: "github", githubId: "123456" },
        $email: "danae@example.com",
        $address: "Idaho Falls, ID",
        $accountType: "subscription"
      }
    }
  */
  let data;
  try {
    if (!req.params.userId) throw new InvalidDataError();
    data = await usersModel.updateUser(req.params.userId, req.body);
  }
  /*
    #swagger.responses[200] = {
      description: 'User found and updated.',
      schema: {
        id: "000000000000000000000000",
        firstName: "Danae",
        lastName: "Gomez",
        oauth: { provider: "github", githubId: "123456" },
        email: "danae@example.com",
        address: "Idaho Falls, ID",
        accountType: "subscription"
      }
    }
    #swagger.responses[400] = { description: 'Invalid user id or body.' }
    #swagger.responses[404] = { description: 'User not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested user not found." });
    if (err.name === "ValidationError")
      return res.status(400).json(err);

    console.error(`updateUser: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.status(200).json(data);
};

const deleteUser = async (req, res) => {
  try {
    if (!req.params.userId) throw new InvalidDataError();
    await usersModel.deleteUser(req.params.userId);
  }
  /*
    #swagger.responses[204] = { description: 'User found and deleted.' }
    #swagger.responses[400] = { description: 'Invalid user id.' }
    #swagger.responses[404] = { description: 'User not found.' }
    #swagger.responses[503] = { description: 'Database not ready.' }
  */
  catch (err) {
    if (err instanceof DBNotReadyError)
      return res.status(503).json({ message: "Database not yet ready." });
    if (err instanceof InvalidDataError)
      return res.status(400).json({ message: "Data is missing or invalid." });
    if (err instanceof NotFoundError)
      return res.status(404).json({ message: "Requested user not found." });

    console.error(`deleteUser: ${err.name}: ${err.message}`);
    return res.sendStatus(500);
  }

  res.sendStatus(204);
};

module.exports = {
  getSingleUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
