var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Msg = new Schema({
  idSender: { type: String, required: true },
  content: { type: String, required: true },
  filePath: { type: String },
  isRead: { type: Boolean, required: true, default: false },
  timestamp: { type: Date, required: true, default: new Date() },
});

var Chat = new Schema({
  refUserA: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  refUserB: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  msgs: [Msg],
  lastMsg: Msg
});

module.exports = mongoose.model("Chat", Chat);
