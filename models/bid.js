const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bidSchema = mongoose.Schema({
  bidderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Task" },
  description: { type: String, required: true, unique: true },
  budget: { type: Number, required: true },
  duration: { type: Number, required: true}
});

bidSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Bid", bidSchema);
