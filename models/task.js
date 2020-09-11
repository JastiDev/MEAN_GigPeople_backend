const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Category" },
  location: { type: String, required: true, default: "*" },
  minBudget: { type: Number, required: true },
  maxBudget: { type: Number, required: true },
  skillIds: [mongoose.Schema({
    skillId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Skill" }
  })],
  isHourly: { type: Boolean, required: true, default: false },
  description: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  bidIds: [mongoose.Schema({
    bidId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Bid" }
  })],
  status: { type: Number, required: true, default: 0 },
  chatIds: [mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Chat" }
  })]
});

module.exports = mongoose.model("Task", taskSchema);
