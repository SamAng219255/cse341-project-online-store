const reviewsModel = require("../models/example");
const { DBNotReadyError, InvalidDataError, NotFoundError, ConflictingValueError } = require("../error_types");

const getReviewById = async(req, res, next) => {
	let data;
	try {
		if(req.params.reviewId == undefined)
			throw new InvalidDataError();

		data = await reviewsModel.getReviewById(req.params.reviewId);
	}
	/*
		#swagger.responses[200] = {
			description: 'Review found and returned.',
			schema: {
				id: "000000000000000000000000",
				customer: "000000000000000000000000",
				product: "000000000000000000000000",
				stars: 4,
				body: "This product is really good and I highly reccomend it."
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid review id.' }
		#swagger.responses[404] = { description: 'No review with the provided id exists.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested review not found" });
		else {
			console.error(`getReviewById: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const getAllReviews = async(req, res, next) => {
	let data;
	try {
		data = await reviewsModel.getAllReviews();
	}
	/*
		#swagger.responses[200] = {
			description: 'Returns a list of all reviews.',
			schema: [{
				id: "000000000000000000000000",
				customer: "000000000000000000000000",
				product: "000000000000000000000000",
				stars: 4,
				body: "This product is really good and I highly reccomend it."
			}]
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database is not yet ready." });
		else {
			console.error(`getAllReviews: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const createReview = async(req, res, next) => {
	/*
	#swagger.parameters['New Review Information'] = {
		in: 'body',
		description: 'New value to update review record with.',
		required: true,
		schema: {
			$customer: "000000000000000000000000",
			$product: "000000000000000000000000",
			$stars: 4,
			$body: "This product is really good and I highly reccomend it."
		}
	}
	*/
	let id;
	try {
		if(req.body.githubId && await reviewsModel.githubExists(req.body.githubId, req.params.id))
			throw new ConflictingValueError();

		id = await reviewsModel.createReview(req.body);
	}
	/*
		#swagger.responses[201] = {
			description: 'Review successfully added.',
			schema: {
				id: "000000000000000000000000"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client did not provide sufficient data to create a review record or provided invalid data.' }
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
			console.error(`createReview: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(201).json({ id });
};

const updateReview = async(req, res, next) => {
	/*
	#swagger.parameters['Updated Review Information'] = {
		in: 'body',
		description: 'New value to update review record with.',
		required: true,
		schema: {
			$customer: "000000000000000000000000",
			$product: "000000000000000000000000",
			$stars: 4,
			$body: "This product is really good and I highly reccomend it."
		}
	}
	*/
	let data;
	try {
		if(req.params.reviewId == undefined)
			throw new InvalidDataError();
		if(req.body.githubId && await reviewsModel.githubExists(req.body.githubId, req.params.reviewId))
			throw new ConflictingValueError();

		data = await reviewsModel.updateReview(req.params.reviewId, req.body);
	}
	/*
		#swagger.responses[200] = {
			description: 'Review found and updated.',
			schema: {
				id: "000000000000000000000000",
				customer: "000000000000000000000000",
				product: "000000000000000000000000",
				stars: 4,
				body: "This product is really good and I highly reccomend it."
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid review id or body.' }
		#swagger.responses[404] = { description: 'No review with the provided id exists.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested review not found" });
		else if(err.name == "ValidationError")
			res.status(400).json(err);
		else {
			console.error(`updateReview: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

const deleteReview = async(req, res, next) => {
	try {
		if(req.params.reviewId == undefined)
			throw new InvalidDataError();

		await tasksModel.removeTasksByReview(req.params.reviewId);
		await reviewsModel.deleteReview(req.params.reviewId);
	}
	/*
		#swagger.responses[204] = { description: 'Review found and deleted.' }
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid review id.' }
		#swagger.responses[404] = { description: 'No review with the provided id exists.' }
		#swagger.responses[401] = { description: 'Attempted to access the endpoint without authenticating.' }
		#swagger.responses[403] = { description: 'Attempted to access the endpoint without matching authorization.' }
	*/
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested review not found" });
		else {
			console.error(`deleteReview: ${err.name}: ${err.message}`);
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
	getAllReviews,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};