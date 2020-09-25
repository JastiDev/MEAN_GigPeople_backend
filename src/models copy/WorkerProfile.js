var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var WorkerProfile = new Schema({
  refUser: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refSkills: [{ type: Schema.Types.ObjectId, required: true, ref: "Skill" }],
  refWorkerReviews: [
    { type: Schema.Types.ObjectId, required: true, ref: "WorkerReview" },
  ],
  title: { type: String, required: true },
  description: { type: String, required: true },
  refTasks: [{ type: Schema.Types.ObjectId, required: true, ref: "Task" }],
  refBids: [{ type: Schema.Types.ObjectId, required: true, ref: "Bid" }],
}); 

module.exports = mongoose.model("WorkerProfile", WorkerProfile);
