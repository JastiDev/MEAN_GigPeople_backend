
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EmployerProfile = new Schema({
  refUser: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refEmployerReviews: [
    { type: Schema.Types.ObjectId, required: true, ref: "EmployerReview" },
  ],
  refTasks: [{ type: Schema.Types.ObjectId, required: true, ref: "Task" }],
  title: { type: String, required: true },
  description: { type: String, required: true },
}); 
module.exports = mongoose.model("EmployerProfile", EmployerProfile);