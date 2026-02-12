const mongoose = require("mongoose");
const { DBNotReadyError } = require("../error_types");
if(!process.env.MONGO_URI) require("dotenv").config();

mongoose.Promise = global.Promise;

let _ready = false;
const isReady = () => {
	if(process.env?.NODE_ENV === "test")
		return true;

	return _ready;
};

const _onReady = [];
const addOnReady = func => {
	_onReady.push(func);
	if(isReady())
		func();
};

const wrapReadyCheck = func => {
	return async(...args) => {
		if(isReady())
			return await func(...args);
		else
			throw new DBNotReadyError();
	};
};

if(process.env?.NODE_ENV !== "test")
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			if(process.env?.NODE_ENV !== "test") console.log("Connected to the database!");
			_ready = true;
			_onReady.forEach(func => func());
		})
		.catch(err => {
			console.log("Cannot connect to the database!", err);
			process.exit();
		});

module.exports = {
	mongoose,
	isReady,
	addOnReady,
	wrapReadyCheck,
};
