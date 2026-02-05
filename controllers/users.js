const usersModel = require("../models/users");
const { DBNotReadyError, InvalidDataError, NotFoundError, ConflictingValueError } = require("../error_types");

const getSingleUser = async(req, res, next) => {
	let data;
	try {
		if(req.params.userId == undefined)
			throw new InvalidDataError();

		data = await usersModel.getSingleUser(req.params.userId);
	}
	/*
		#swagger.responses[200] = {
			description: 'User found and returned.',
			schema: {
				id: "000000000000000000000000",
				fname: "John",
				lname: "Doe",
				email: "user@example.com",
				githubId: "00000000",
				address: "123 example rd, anywhere US",
				type: "customer"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid user id.' }
		#swagger.responses[404] = { description: 'No user with the provided id exists.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/

	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested user not found" });
		else {
			console.error(`getSingleUser: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};




const getAllUsers = async(req, res, next) => {
	let data;
	try {
		data = await usersModel.getAllUsers();
	}
	/*
		#swagger.responses[200] = {
			description: 'Returns a list of all products.',
			schema: [{
				id: "000000000000000000000000",
				fname: "John",
				lname: "Doe",
				email: "user@example.com",
				githubId: "00000000",
				address: "123 example rd, anywhere US",
				type: "customer"
			}]
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database is not yet ready." });
		else {
			console.error(`getAllUsers: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const createUser = async(req, res, next) => {
	/*
	#swagger.parameters['New User Information'] = {
		in: 'body',
		description: 'New information to update user record with.',
		required: true,
		schema: {
			$fname: "John",
			$lname: "Doe",
			$email: "user@example.com",
			$githubId: "00000000",
			$address: "123 example rd, anywhere US"
		}
	}
	*/
	let id;
	try {
		if(req.body.githubId && await usersModel.githubExists(req.body.githubId, req.params.id))
			throw new ConflictingValueError();

		id = await usersModel.createUser(req.body);
	}
	/*
		#swagger.responses[201] = {
			description: 'User successfully added.',
			schema: {
				id: "000000000000000000000000"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client did not provide sufficient data to create a user record or provided invalid data.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`createUser: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(201).json({ id });
};

const updateUser = async(req, res, next) => {
	/*
	#swagger.parameters['Updated User Information'] = {
		in: 'body',
		description: 'New information to update user record with.',
		required: true,
		schema: {
			$fname: "John",
			$lname: "Doe",
			$email: "user@example.com",
			$githubId: "00000000",
			$address: "123 example rd, anywhere US"
		}
	}
	*/
	let data;
	try {
		if(req.params.userId == undefined)
			throw new InvalidDataError();
		if(req.body.githubId && await usersModel.githubExists(req.body.githubId, req.params.userId))
			throw new ConflictingValueError();

		data = await usersModel.updateUser(req.params.userId, req.body);
	}
	/*
		#swagger.responses[200] = {
			description: 'User found and updated.',
			schema: {
				id: "000000000000000000000000",
				fname: "John",
				lname: "Doe",
				email: "user@example.com",
				githubId: "00000000",
				address: "123 example rd, anywhere US",
				type: "customer"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid user id or body.' }
		#swagger.responses[404] = { description: 'No product with the provided id exists.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested user not found" });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`updateUser: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const deleteUser = async(req, res, next) => {
	try {
		if(req.params.userId == undefined)
			throw new InvalidDataError();

		await tasksModel.removeTasksByUser(req.params.userId);
		await usersModel.deleteUser(req.params.userId);
	}
	/*
		#swagger.responses[204] = { description: 'User found and deleted.' }
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid user id.' }
		#swagger.responses[404] = { description: 'No product with the provided id exists.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested user not found" });
		else {
			console.error(`deleteUser: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	try {
		req.logout(function(err) {
			if(err) return next(err);
		});
	}
	finally {
		req.session.destroy();
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
