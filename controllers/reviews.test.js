const { Types: { ObjectId } } = require("mongoose");
const { mongoose } = require("../database/");
const { reviewsModel } = require("../models/reviews");
const reviewsController = require("./reviews");
const TestRead = require("../TestRead");
const { mockingoose } = require('mockingoose');

const testReviewIdCorrect = "507f191e810c19729de860ea";
const testReviewIdWrong = "507f191e810c19729de860eb";

describe('test mongoose Reviews model', () => {
	const _doc = {
		_id: new ObjectId(testReviewIdCorrect),
		customer: "000000000000000000000000",
		product: "000000000000000000000000",
		stars: 4,
		body: "This product is really good and I highly reccomend it."
	};

	beforeEach(() => {
		mockingoose.resetAll();
	});

	new TestRead("should return the doc with getReviewById", {
		req: {
			reviewId: testReviewIdCorrect
		},
		model: reviewsModel,
		readFuncName: "findOne",
		testFunc: reviewsController.getReviewById,
		doc: _doc,
	}).makeTest();

	new TestRead("should return a 404 error from getReviewById", {
		req: {
			reviewId: testReviewIdWrong
		},
		model: reviewsModel,
		readFuncName: "findOne",
		testFunc: reviewsController.getReviewById,
		doc: _doc,
		expectedStatus: 404,
		matchDoc: false,
	}).makeTest();

	new TestRead("should return a 400 error from getReviewById", {
		req: {},
		model: reviewsModel,
		readFuncName: "findOne",
		testFunc: reviewsController.getReviewById,
		doc: _doc,
		expectedStatus: 400,
		matchDoc: false,
	}).makeTest();

	new TestRead("should return the doc in an array with getAllReviews", {
		model: reviewsModel,
		readFuncName: "find",
		testFunc: reviewsController.getAllReviews,
		doc: [_doc],
	}).makeTest();
});