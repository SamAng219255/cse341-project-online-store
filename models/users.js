const { mongoose, wrapReadyCheck } = require("../database/");
const { InvalidDataError, NotFoundError } = require("../error_types");

const ObjectId = mongoose.Types.ObjectId;

const _model = mongoose.model("users", mongoose.Schema({
  firstName: String,
  lastName: String,
  oauth: Object,
  email: String,
  address: String,
  accountType: {
    type: String,
    enum: ["customer", "employee", "subscription"]
  }
}, { timestamps: true }));

const keys = ["firstName", "lastName", "oauth", "email", "address", "accountType"];

const copyNeededKeys = obj =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));

const getAllUsers = wrapReadyCheck(async () => await _model.find());

const getSingleUser = wrapReadyCheck(async id => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  const result = await _model.findById(_id);
  if (!result) throw new NotFoundError();
  return result;
});

const createUser = wrapReadyCheck(async data => {
  if (!keys.every(k => k in data)) throw new InvalidDataError();
  const _id = new ObjectId();
  await _model.create({ _id, ...copyNeededKeys(data) });
  return _id.toString();
});

const updateUser = wrapReadyCheck(async (id, data) => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  if (!await _model.findById(_id)) throw new NotFoundError();
  const cleaned = copyNeededKeys(data);
  await new mongoose.Document(cleaned, _model.schema).validate();
  await _model.updateOne({ _id }, cleaned);
  return await _model.findById(_id);
});

const deleteUser = wrapReadyCheck(async id => {
  let _id;
  try { _id = new ObjectId(id); } catch { throw new InvalidDataError(); }
  const result = await _model.deleteOne({ _id });
  if (result.deletedCount < 1) throw new NotFoundError();
});

const getSingleUserbyGithubId = wrapReadyCheck(async githubId => {
  const result = await _model.findOne({ "oauth.githubId": githubId });
  return result;
});

module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser, getSingleUserbyGithubId };