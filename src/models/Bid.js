var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Bid = new Schema({
  refTask: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
  refBidder: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  duration: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}); 

module.exports = mongoose.model("Bid", Bid);
