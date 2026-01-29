/* // Remove this
const { mongoose, wrapReadyCheck } = require("../database/");
const { InvalidDataError, NotFoundError } = require("../error_types");

const ObjectId = mongoose.Types.ObjectId;

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const _model = mongoose.model(
	"users",
	mongoose.Schema(
		{
			name: {
				type: String,
				minLength: 3,
			},
			email: {
				type: String,
				validate: (value) => emailRegex.test(value),
			},
			password: String,
		},
		{ timestamps: true },
	),
);

const keys = [
	"name",
	"email",
	"password",
];

const copyNeededKeys = oldObj => Object.fromEntries(keys.filter(key => key in oldObj).map(key => [ key, oldObj[key] ]));

const get = wrapReadyCheck(async id => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`get/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	let result;
	try {
		result = await _model.findById(_id);
	}
	catch(err) {
		console.error(`get/findById: ${err.name}: ${err.message}`);
		throw err;
	}

	if(result == null)
		throw new NotFoundError();

	return result;
});

module.exports = {
	get,
};
*/ // Remove this