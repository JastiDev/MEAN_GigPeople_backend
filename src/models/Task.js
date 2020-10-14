var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Task = new Schema({
  refCreator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refCategory: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  refSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String },
  country: { type: String },
  minBudget: { type: Number },
  maxBudget: { type: Number },
  isHourly: { type: Boolean },
  refBids: [{ type: Schema.Types.ObjectId, ref: "Bid" }],
  status: { type: Number, required: true, default: 0 },
  timestamp: { type: Date, required: true, default: new Date() },
  refContract: { type: Schema.Types.ObjectId, ref: 'Contract' }
});
module.exports = mongoose.model("Task", Task);
