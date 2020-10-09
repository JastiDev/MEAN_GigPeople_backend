const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

router.get('', async (req, res, next) => { 
  try { 
    let arr = await Skill.find();
    res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Internal error."});
  }
});

module.exports = router;