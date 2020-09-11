const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const nationSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

nationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Nation", nationSchema);
