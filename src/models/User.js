var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  avatar: { type: String },
  refWorkerProfile: {
    type: Schema.Types.ObjectId,
    ref: "WorkerProfile",
  },
  refEmployerProfile: {
    type: Schema.Types.ObjectId,
    ref: "EmployerProfile",
  },
  refFinancialProfile: {
    type: Schema.Types.ObjectId,
    ref: "FinancialProfile",
  },
}); 

User.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("User", User);
