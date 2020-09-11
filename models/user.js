const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Nation" },
  workerProfile: mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillIds: [mongoose.Schema({
      skillId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Skill" }
    })]
  }),
  employerProfile: mongoose.Schema({

  }),
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
