/* // Remove this
const model = require("../models/example");
const { DBNotReadyError, InvalidDataError, NotFoundError, ConflictingValueError } = require("../error_types");

const get = async(req, res, next) => {
	let data;
	try {
		if(req.params.id == undefined)
			throw new InvalidDataError();

		data = await model.get(req.params.id);
	}
	/*
		#swagger.responses[200] = {
			description: 'User found and returned.',
			schema: {
				id: "000000000000000000000000",
				name: "John Doe",
				email: "user@example.com"
			}
		}
		#swagger.responses[503] = { description: 'Server still turning on and not yet connected to database.' }
		#swagger.responses[400] = { description: 'Client provided an invalid user id.' }
		#swagger.responses[404] = { description: 'No user with the provided id exists.' }
	*/
/* // Remove this
	catch(err) {
		if(err instanceof DBNotReadyError)
			res.status(503).json({ message: "Database not yet ready." });
		else if(err instanceof InvalidDataError)
			res.status(400).json({ message: "Data is missing or invalid." });
		else if(err instanceof NotFoundError)
			res.status(404).json({ message: "Requested user not found" });
		else {
			console.error(`get: ${err.name}: ${err.message}`);
			res.sendStatus(500);
		}
	}
	res.status(200).json(data);
};

module.exports = {
	get,
};
*/ // Remove this