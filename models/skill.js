var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Skill = new Schema({ title: { type: String, required: true, unique: true } });

Skill.plugin(require("mongoose-unique-validator"));

module.exports = mongoose.model("Skill", Skill);