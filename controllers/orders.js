const model = require("../models/orders");
const { DBNotReadyError, InvalidDataError, NotFoundError, ConflictingValueError } = require("../error_types");

const getSingleOrder = async(req, res, next) => {
	let data;
	try {
		if(req.params.orderId == undefined)
			throw new InvalidDataError();

		data = await ordersModel.getSingleOrder(req.params.orderId);
	}
	/*
		#swagger.responses[200] = {
			description: 'order found and returned.',
			schema: {
				id: "000000000000000000000000",
				name: "John Doe",
				email: "order@example.com"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid order id.' }
		#swagger.responses[404] = { description: 'No order with the provided id exists.' }
	*/

	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested order not found" });
		else {
			console.error(`getSingleOrder: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};




const getAllOrders = async(req, res, next) => {
	let data;
	try {
		data = await ordersModel.getAllOrders();
	}
	/*
		#swagger.responses[200] = {
			description: 'Returns a list of all products.',
			schema: [{
				id: "000000000000000000000000",
				name: "Sweatshirt",
				description: "A classic everyday sweatshirt made from a soft, mid-weight cotton blend for all-day comfort. Designed with a relaxed fit, ribbed cuffs, and a durable finish that holds up to regular wear and washing. Perfect for layering or wearing on its own in any season.",
				price: 1999,
				inStock: "in",
				discount: 10,
				options: [["red", "blue", "gray", "black"], ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]]
			}]
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database is not yet ready." });
		else {
			console.error(`getAllOrders: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const createOrder = async(req, res, next) => {
	/*
	#swagger.parameters['New Order Information'] = {
		in: 'body',
		description: 'New information to update order record with.',
		required: true,
		schema: {
			$name: "Sweatshirt",
			$description: "A classic everyday sweatshirt made from a soft, mid-weight cotton blend for all-day comfort. Designed with a relaxed fit, ribbed cuffs, and a durable finish that holds up to regular wear and washing. Perfect for layering or wearing on its own in any season.",
			$price: 1999,
			$inStock: "in",
			$discount: 10,
			$options: [["red", "blue", "gray", "black"], ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]]
		}
	}
	*/
	let id;
	try {
		if(req.body.githubId && await ordersModel.githubExists(req.body.githubId, req.params.id))
			throw new ConflictingValueError();

		id = await ordersModel.createOrder(req.body);
	}
	/*
		#swagger.responses[201] = {
			description: 'Order successfully added.',
			schema: {
				id: "000000000000000000000000"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client did not provide sufficient data to create a order record or provided invalid data.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`createOrder: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(201).json({ id });
};

const updateOrder = async(req, res, next) => {
	/*
	#swagger.parameters['Updated order Information'] = {
		in: 'body',
		description: 'New information to update order record with.',
		required: true,
		schema: {
			$name: "Sweatshirt",
			$description: "A classic everyday sweatshirt made from a soft, mid-weight cotton blend for all-day comfort. Designed with a relaxed fit, ribbed cuffs, and a durable finish that holds up to regular wear and washing. Perfect for layering or wearing on its own in any season.",
			$price: 1999,
			$inStock: "in",
			$discount: 10,
			$options: [["red", "blue", "gray", "black"], ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]]
		}
	}
	*/
	let data;
	try {
		if(req.params.orderId == undefined)
			throw new InvalidDataError();
		if(req.body.githubId && await ordersModel.githubExists(req.body.githubId, req.params.orderId))
			throw new ConflictingValueError();

		data = await ordersModel.updateOrder(req.params.orderId, req.body);
	}
	/*
		#swagger.responses[200] = {
			description: 'Order found and updated.',
			schema: {
				id: "000000000000000000000000",
				name: "Sweatshirt",
				description: "A classic everyday sweatshirt made from a soft, mid-weight cotton blend for all-day comfort. Designed with a relaxed fit, ribbed cuffs, and a durable finish that holds up to regular wear and washing. Perfect for layering or wearing on its own in any season.",
				price: 1999,
				inStock: "in",
				discount: 10,
				options: [["red", "blue", "gray", "black"], ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]]
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid order id or body.' }
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
			res.status(404).json({ message: "Requested order not found" });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`updateOrder: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const deleteOrder = async(req, res, next) => {
	try {
		if(req.params.orderId == undefined)
			throw new InvalidDataError();

		await tasksModel.removeTasksByOrder(req.params.orderId);
		await ordersModel.deleteOrder(req.params.orderId);
	}
	/*
		#swagger.responses[204] = { description: 'order found and deleted.' }
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid order id.' }
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
			res.status(404).json({ message: "Requested order not found" });
		else {
			console.error(`deleteOrder: ${err.name}: ${err.message}`);
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
	getSingleOrder,
	getAllOrders,
	createOrder,
	updateOrder,
	deleteOrder
};
