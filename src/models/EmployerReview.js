
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EmployerReview = new Schema({
  refTask: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
  refWorker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refEmployer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  star: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Number, required: true, default: Date.now() },
}); 
module.exports = mongoose.model("EmployerReview", EmployerReview);