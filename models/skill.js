const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const skillSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

skillSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Skill", skillSchema);
