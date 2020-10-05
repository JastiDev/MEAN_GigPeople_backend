var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var WorkerProfile = new Schema({
  refUser: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refSkills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  refWorkerReviews: [
    { type: Schema.Types.ObjectId, ref: "WorkerReview" },
  ],
  hourlyRate: { type: Number },
  title: { type: String },
  description: { type: String },
  refTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  refBids: [{ type: Schema.Types.ObjectId, ref: "Bid" }],
});

module.exports = mongoose.model("WorkerProfile", WorkerProfile);
