const { Types: { ObjectId } } = require("mongoose");
const { mongoose } = require("../database/");
const { ordersModel } = require("../models/orders");
const ordersController = require("./orders");
const TestRead = require("../TestRead");
const { mockingoose } = require("mockingoose");

const testOrderIdCorrect = "507f191e810c19729de860ea";
const testOrderIdWrong = "507f191e810c19729de860eb";
const testCustomerId = "507f1f77bcf86cd799439011";

describe("test mongoose Orders model", () => {
  const _doc = {
    _id: new ObjectId(testOrderIdCorrect),
    itemIds: ["item1", "item2"],
    customerId: testCustomerId,
    productCount: 2,
    orderDate: new Date("2026-02-04"),
  };

  beforeEach(() => {
    mockingoose.resetAll();
  });

  // GET SINGLE ORDER

  new TestRead("should return the doc with getSingleOrder", {
    req: { orderId: testOrderIdCorrect },
    model: ordersModel,
    readFuncName: "findOne",
    testFunc: ordersController.getSingleOrder,
    doc: _doc,
  }).makeTest();

  new TestRead("should return a 404 error from getSingleOrder", {
    req: { orderId: testOrderIdWrong },
    model: ordersModel,
    readFuncName: "findOne",
    testFunc: ordersController.getSingleOrder,
    doc: _doc,
    expectedStatus: 404,
    matchDoc: false,
  }).makeTest();

  new TestRead("should return a 400 error from getSingleOrder", {
    req: {},
    model: ordersModel,
    readFuncName: "findOne",
    testFunc: ordersController.getSingleOrder,
    doc: _doc,
    expectedStatus: 400,
    matchDoc: false,
  }).makeTest();

  // GET ALL ORDERS - ADMIN

  new TestRead("should return all orders for administrator", {
    reqUse: null,
    req: {
      user: {
        _id: new ObjectId(testCustomerId),
        role: "administrator",
      },
    },
    model: ordersModel,
    readFuncName: "find",
    testFunc: ordersController.getAllOrders,
    doc: [_doc],
  }).makeTest();

  // GET ALL ORDERS - CUSTOMER

  new TestRead("should return only customer orders for customer role", {
    reqUse: null,
    req: {
      user: {
        _id: new ObjectId(testCustomerId),
        role: "customer",
      },
    },
    model: ordersModel,
    readFuncName: "find",
    testFunc: ordersController.getAllOrders,
    doc: [_doc],
  }).makeTest();
});
