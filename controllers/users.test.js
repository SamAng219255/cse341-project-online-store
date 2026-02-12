const { Types: { ObjectId } } = require("mongoose");
const { mongoose } = require("../database/");
const { usersModel } = require("../models/users");
const usersController = require("./users");
const TestRead = require("../TestRead");
const { mockingoose } = require('mockingoose');

const testUserIdCorrect = "507f191e810c19729de860ea";
const testUserIdWrong = "507f191e810c19729de860eb";

describe('test mongoose Users model', () => {
  const _doc = {
    _id: new ObjectId(testUserIdCorrect),
    firstName: "Danae",
    lastName: "De la Cruz",
    oauth: { provider: "github", id: "12345" },
    email: "danae@test.com",
    address: "Mexico",
    accountType: "customer"
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  new TestRead("should return the doc with getSingleUser", {
    req: { userId: testUserIdCorrect },
    model: usersModel,
    readFuncName: "findOne",
    testFunc: usersController.getSingleUser,
    doc: _doc,
  }).makeTest();

  new TestRead("should return a 404 error from getSingleUser", {
    req: { userId: testUserIdWrong },
    model: usersModel,
    readFuncName: "findOne",
    testFunc: usersController.getSingleUser,
    doc: _doc,
    expectedStatus: 404,
    matchDoc: false,
  }).makeTest();

  new TestRead("should return a 400 error from getSingleUser", {
    req: {},
    model: usersModel,
    readFuncName: "findOne",
    testFunc: usersController.getSingleUser,
    doc: _doc,
    expectedStatus: 400,
    matchDoc: false,
  }).makeTest();

  new TestRead("should return the doc in an array with getAllUsers", {
    model: usersModel,
    readFuncName: "find",
    testFunc: usersController.getAllUsers,
    doc: [_doc],
  }).makeTest();
});
