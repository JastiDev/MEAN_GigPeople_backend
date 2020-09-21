var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = new Schema({
  createdAt: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  refWorkerProfile: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "WorkerProfile",
  },
  refEmployerProfile: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "EmployerProfile",
  },
  refFinancialProfile: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "FinancialProfile",
  },
}); 

User.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("User", User);
