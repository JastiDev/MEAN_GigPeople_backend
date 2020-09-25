
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Transaction = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: Number, required: true },
});

module.exports = mongoose.model("Transaction", Transaction);