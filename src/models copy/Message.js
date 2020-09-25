
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Message = new Schema({
  balance: { type: Number, required: true },
  refTransactions: [
    { type: Schema.Types.ObjectId, required: true, ref: "Transaction" },
  ],
}); 
module.exports = mongoose.model("Message", Message);