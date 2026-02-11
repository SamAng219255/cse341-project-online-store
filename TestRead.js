const { mockingoose } = require('mockingoose');
const mongoose = require("mongoose");
const sift = require('sift').default;

class TestResponse {
	#lock = false;
	statusCode = 0;
	status(code) {
		if(this.#lock) return this;

		this.statusCode = code;
		return this;
	}

	data = {};
	json(data) {
		if(this.#lock) return;

		this.#lock = true;
		this.data = data;
	}

	sendStatus(code) {
		this.status(code);
		this.json(null);
	}
}

module.exports = class TestRead {
	#doc;
	#readFunc;
	#testFunc;
	#expectedStatus;
	#matchDoc;
	#desc;
	#model;

	constructor(desc, {
		req = {},
		reqUse = "params",
		model,
		readFuncName,
		testFunc,
		doc,
		expectedStatus = 200,
		matchDoc = true,
	}) {
		this.req = reqUse ? { [reqUse]: req } : req;
		this.res = new TestResponse();
		this.#model = model;
		this.#doc = doc;
		this.#readFunc = readFuncName;
		this.#testFunc = testFunc;
		this.#expectedStatus = expectedStatus;
		this.#matchDoc = matchDoc;
		this.#desc = desc;
	}

	makeTest() {
		test(this.#desc, () => this.test());

		return this;
	}

	queryMatchesDoc(query) {
		return sift(query.getQuery())(this.#doc) ? this.#doc : null;
	}

	async test() {
		mockingoose(this.#model).toReturn((query) => this.queryMatchesDoc(query), this.#readFunc);

		await this.#testFunc(this.req, this.res, () => { return; });

		if(this.#expectedStatus != null) expect(this.res.statusCode).toBe(this.#expectedStatus);
		if(this.#matchDoc) expect(JSON.parse(JSON.stringify(this.res.data))).toEqual(JSON.parse(JSON.stringify(this.#doc)));
	}
};