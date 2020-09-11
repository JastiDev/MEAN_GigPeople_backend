const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const categorySchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Category", categorySchema);
