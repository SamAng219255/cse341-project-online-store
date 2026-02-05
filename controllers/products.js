const productsModel = require("../models/products");
const { DBNotReadyError, InvalidDataError, NotFoundError, ConflictingValueError } = require("../error_types");

const getProductById = async(req, res, next) => {
	let data;
	try {
		if(req.params.productId == undefined)
			throw new InvalidDataError();

		data = await productsModel.getProductById(req.params.productId);
	}
	/*
		#swagger.responses[200] = {
			description: 'Product found and returned.',
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
		#swagger.responses[400] = { description: 'Client provided an invalid product id.' }
		#swagger.responses[404] = { description: 'No product with the provided id exists.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested product not found" });
		else {
			console.error(`getProductById: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const getAllProducts = async(req, res, next) => {
	let data;
	try {
		data = await productsModel.getAllProducts();
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
			console.error(`getAllProducts: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const createProduct = async(req, res, next) => {
	/*
	#swagger.parameters['New Product Information'] = {
		in: 'body',
		description: 'New value to update product record with.',
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
		if(req.body.githubId && await productsModel.githubExists(req.body.githubId, req.params.id))
			throw new ConflictingValueError();

		id = await productsModel.createProduct(req.body);
	}
	/*
		#swagger.responses[201] = {
			description: 'Product successfully added.',
			schema: {
				id: "000000000000000000000000"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client did not provide sufficient data to create a product record or provided invalid data.' }
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
			console.error(`createProduct: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(201).json({ id });
};

const updateProduct = async(req, res, next) => {
	/*
	#swagger.parameters['Updated Product Information'] = {
		in: 'body',
		description: 'New value to update product record with.',
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
		if(req.params.productId == undefined)
			throw new InvalidDataError();
		if(req.body.githubId && await productsModel.githubExists(req.body.githubId, req.params.productId))
			throw new ConflictingValueError();

		data = await productsModel.updateProduct(req.params.productId, req.body);
	}
	/*
		#swagger.responses[200] = {
			description: 'Product found and updated.',
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
		#swagger.responses[400] = { description: 'Client provided an invalid product id or body.' }
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
			res.status(404).json({ message: "Requested product not found" });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`updateProduct: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const deleteProduct = async(req, res, next) => {
	try {
		if(req.params.productId == undefined)
			throw new InvalidDataError();

		//await reviewssModel.removeReviewsByProduct(req.params.productId);
		await productsModel.deleteProduct(req.params.productId);
	}
	/*
		#swagger.responses[204] = { description: 'Product found and deleted.' }
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid product id.' }
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
			res.status(404).json({ message: "Requested product not found" });
		else {
			console.error(`deleteProduct: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.sendStatus(204);
};

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};