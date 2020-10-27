var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var FinancialProfile = new Schema({
  refUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
  refTransactions: [{type: Schema.Types.ObjectId, ref: "Transaction"}],
});

module.exports = mongoose.model("FinancialProfile", FinancialProfile);