const { mongoose, wrapReadyCheck } = require("../database/");
const { InvalidDataError, NotFoundError } = require("../error_types");

const ObjectId = mongoose.Types.ObjectId;

const _model = mongoose.model(
	"reviews",
	mongoose.Schema(
		{
			customer: mongoose.ObjectId,
			product: mongoose.ObjectId,
			stars: {
				type: Number,
				min: 1,
				max: 5,
				validate: Number.isInteger,
			},
			body: String,
		},
		{ timestamps: true },
	),
);

const keys = [
	"customer",
	"product",
	"stars",
	"body",
];

const copyNeededKeys = oldObj => Object.fromEntries(keys.filter(key => key in oldObj).map(key => [ key, oldObj[key] ]));

const getAllReviews = wrapReadyCheck(async id => {
	try {
		return await _model.find();
	}
	catch(err) {
		console.error(`getAllReviews/find: ${err.name}: ${err.message}`);
		throw err;
	}
});

const getReviewById = wrapReadyCheck(async id => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`getReviewById/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	let result;
	try {
		result = await _model.findById(_id);
	}
	catch(err) {
		console.error(`getReviewById/findById: ${err.name}: ${err.message}`);
		throw err;
	}

	if(result == null)
		throw new NotFoundError();

	return result;
});

const createReview = wrapReadyCheck(async data => {
	if(!keys.every(key => key in data))
		throw new InvalidDataError();

	const _id = new ObjectId();

	try {
		await _model.create({ _id, ...copyNeededKeys(data) }); // Data is automatically validated against the schema
	}
	catch(err) {
		console.error(`createReview/create: ${err.name}: ${err.message}`);
		throw err;
	}

	return _id.toString();
});

const updateReview = wrapReadyCheck(async(id, data) => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`updateReview/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	if(await _model.findById(_id) == null)
		throw new NotFoundError();

	const cleanedData = copyNeededKeys(data);

	try {
		await new mongoose.Document(cleanedData, _model.schema).validate();

		await _model.updateOne({ _id }, cleanedData);
	}
	catch(err) {
		console.error(`updateReview/updateOne: ${err.name}: ${err.message}`);
		throw err;
	}

	return await _model.findById(_id);
});

const deleteReview = wrapReadyCheck(async id => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`deleteReview/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	const result = await _model.deleteOne({ _id });

	if(result.deletedCount < 1)
		throw new NotFoundError();
});

module.exports = {
	reviewsModel: _model,
	getAllReviews,
	getReviewById,
	createReview,
	updateReview,
	deleteReview,
};