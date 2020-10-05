var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var EmployerProfile = new Schema({
  refUser: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refEmployerReviews: [
    { type: Schema.Types.ObjectId, ref: "EmployerReview" },
  ],
  refTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  title: { type: String },
  description: { type: String },
}); 
module.exports = mongoose.model("EmployerProfile", EmployerProfile);