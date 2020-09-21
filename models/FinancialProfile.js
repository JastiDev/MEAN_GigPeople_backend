var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var WorkerReview = new Schema({
  refTask: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
  refWorker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refEmployer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  starOnTime: { type: Number, required: true },
  starOnBudget: { type: Number, required: true },
  star: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("WorkerReview", WorkerReview);