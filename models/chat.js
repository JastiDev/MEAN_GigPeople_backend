const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const chatSchema = mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, 
  bidderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Task" },
  messages: [mongoose.Schema({
    content: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, 
    timestamp: { type: Number, required: true, default: Date.now() }
  })]
});

chatSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Chat", chatSchema);
