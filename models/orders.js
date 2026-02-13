const { mongoose, wrapReadyCheck } = require("../database/");
const { InvalidDataError, NotFoundError } = require("../error_types");

const ObjectId = mongoose.Types.ObjectId;

const _model = mongoose.model("orders", mongoose.Schema({
  itemIds: {
  type: [String],
  required: true
  },
  customerId: {
  type: String,
  required: true
  },
  productCount: {
    type: Number,
    validate: Number.isInteger
  },
  orderDate: Date
}, { timestamps: true }));

const keys = ["itemIds", "customerId", "productCount", "orderDate"];

const copyNeededKeys = obj =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

const getAllOrders = wrapReadyCheck(async () => await _model.find());

const getSingleOrder = wrapReadyCheck(async id => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  const result = await _model.findById(_id);
  if (!result) throw new NotFoundError();
  return result;
});

const createOrder = wrapReadyCheck(async data => {
  if (!keys.every(k => k in data)) throw new InvalidDataError();
  const _id = new ObjectId();
  await _model.create({ _id, ...copyNeededKeys(data) });
  return _id.toString();
});

const updateOrder = wrapReadyCheck(async (id, data) => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  if (!await _model.findById(_id)) throw new NotFoundError();
  const cleaned = copyNeededKeys(data);
  await new mongoose.Document(cleaned, _model.schema).validate();
  await _model.updateOne({ _id }, cleaned);
  return await _model.findById(_id);
});

const deleteOrder = wrapReadyCheck(async id => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  const result = await _model.deleteOne({ _id });
  if (result.deletedCount < 1) throw new NotFoundError();
});

module.exports = { ordersModel: _model, getAllOrders, getSingleOrder, createOrder, updateOrder, deleteOrder };
