const { mongoose, wrapReadyCheck } = require("../database/");
const { InvalidDataError, NotFoundError } = require("../error_types");

const ObjectId = mongoose.Types.ObjectId;

const _model = mongoose.model(
	"products",
	mongoose.Schema(
		{
			name: String,
			description: String,
			price: {
				type: Number,
				validate: Number.isInteger,
			},
			inStock: {
				type: String,
				enum: [
					"in",
					"<100",
					"<10",
					"5",
					"4",
					"3",
					"2",
					"1",
					"out"
				]
			},
			discount: {
				type: Number,
				validate: Number.isInteger,
			},
			options: [[String]],

		},
		{ timestamps: true },
	),
);

const keys = [
	"name",
	"description",
	"price",
	"inStock",
	"discount",
	"options",
];

const copyNeededKeys = oldObj => Object.fromEntries(keys.filter(key => key in oldObj).map(key => [ key, oldObj[key] ]));

const getAllProducts = wrapReadyCheck(async id => {
	try {
		return await _model.find();
	}
	catch(err) {
		console.error(`getAllProducts/find: ${err.name}: ${err.message}`);
		throw err;
	}
});

const getProductById = wrapReadyCheck(async id => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`getProductById/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	let result;
	try {
		result = await _model.findById(_id);
	}
	catch(err) {
		console.error(`getProductById/findById: ${err.name}: ${err.message}`);
		throw err;
	}

	if(result == null)
		throw new NotFoundError();

	return result;
});

const createProduct = wrapReadyCheck(async data => {
	if(!keys.every(key => key in data))
		throw new InvalidDataError();

	const _id = new ObjectId();

	try {
		await _model.create({ _id, ...copyNeededKeys(data) }); // Data is automatically validated against the schema
	}
	catch(err) {
		console.error(`createProduct/create: ${err.name}: ${err.message}`);
		throw err;
	}

	return _id.toString();
});

const updateProduct = wrapReadyCheck(async(id, data) => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`updateProduct/ObjectId: ${err.name}: ${err.message}`);
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
		console.error(`updateProduct/updateOne: ${err.name}: ${err.message}`);
		throw err;
	}

	return await _model.findById(_id);
});

const deleteProduct = wrapReadyCheck(async id => {
	let _id;
	try {
		_id = new ObjectId(id);
	}
	catch(err) {
		console.error(`deleteProduct/ObjectId: ${err.name}: ${err.message}`);
		throw new InvalidDataError();
	}

	const result = await _model.deleteOne({ _id });

	if(result.deletedCount < 1)
		throw new NotFoundError();
});

module.exports = {
	productsModel: _model,
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};