const { Types: { ObjectId } } = require("mongoose");
const { mongoose } = require("../database/");
const { productsModel } = require("../models/products");
const productsController = require("./products");
const TestRead = require("../TestRead");
const { mockingoose } = require('mockingoose');

const testProductIdCorrect = "507f191e810c19729de860ea";
const testProductIdWrong = "507f191e810c19729de860eb";

describe('test mongoose Products model', () => {
	const _doc = {
		_id: new ObjectId(testProductIdCorrect),
		name: "Sweatshirt",
		description: "A classic everyday sweatshirt made from a soft, mid-weight cotton blend for all-day comfort. Designed with a relaxed fit, ribbed cuffs, and a durable finish that holds up to regular wear and washing. Perfect for layering or wearing on its own in any season.",
		price: 1999,
		inStock: "in",
		discount: 10,
		options: [["red", "blue", "gray", "black"], ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]]
	};

	beforeEach(() => {
		mockingoose.resetAll();
	});

	afterAll(async () => {
		await mongoose.connection.close();
	});

	new TestRead("should return the doc with getProductById", {
		req: {
			productId: testProductIdCorrect
		},
		model: productsModel,
		readFuncName: "findOne",
		testFunc: productsController.getProductById,
		doc: _doc,
	}).makeTest();

	new TestRead("should return a 404 error from getProductById", {
		req: {
			productId: testProductIdWrong
		},
		model: productsModel,
		readFuncName: "findOne",
		testFunc: productsController.getProductById,
		doc: _doc,
		expectedStatus: 404,
		matchDoc: false,
	}).makeTest();

	new TestRead("should return a 400 error from getProductById", {
		req: {},
		model: productsModel,
		readFuncName: "findOne",
		testFunc: productsController.getProductById,
		doc: _doc,
		expectedStatus: 400,
		matchDoc: false,
	}).makeTest();

	new TestRead("should return the doc in an array with getAllProducts", {
		model: productsModel,
		readFuncName: "find",
		testFunc: productsController.getAllProducts,
		doc: [_doc],
	}).makeTest();
});