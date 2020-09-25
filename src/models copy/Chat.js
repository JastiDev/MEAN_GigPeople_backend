var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Chat = new Schema({
  refTask: { type: Schema.Types.ObjectId, required: true, ref: "Task" },
  refUserA: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refUserB: { type: Schema.Types.ObjectId, required: true, ref: "User" },
}); 

module.exports = mongoose.model("Chat", Chat);
