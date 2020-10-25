var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Contract = new Schema({
  refEmployer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refWorker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refTask: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
  budget: { type: Number, required: true },
  isHourly: { type: Boolean, required: true },
  duration: { type: Number, required: true },
  status: { type: Number, required: true, default: 0 }, // 0: interview, 1: started, 2: FINISHED, 3: canceled
  startDate: { type: Number, required: true },
  endDate: { type: Number, required: true }
});

module.exports = mongoose.model("Contract", Contract);
