var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Task = new Schema({
  refCreator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refCategory: { type: Schema.Types.ObjectId, required: true, ref: "Category" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
  country: { type: String, required: true },
  minBudget: { type: Number, required: true },
  maxBudget: { type: Number, required: true },
  isHourly: { type: Boolean, required: true },
  refBids: [{ type: Schema.Types.ObjectId, required: true, ref: "Bid" }],
  status: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}); 
module.exports = mongoose.model("Task", Task);
