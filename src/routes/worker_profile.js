const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");

router.get("/me", checkAuth, async (req, res, next) => {
  try {
    const me = await WorkerProfile.findOne({ refUser: req.userData.userId });
    if (me === null) return res.status(404).json({message: "No worker-profile found for this user."});

    res.status(200).json(me);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "You are not verified as you." });
  }
});

router.put("/me", checkAuth, async (req, res, next) => {
  try {

    const me = await WorkerProfile.findOne({ refUser: req.userData.userId });
    me.hourlyRate = req.body.hourlyRate;
    me.title = req.body.title;
    me.description = req.body.description;

    await me.save();
    res.status(200).json(me);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "You are not verified as you." });
  }
});


module.exports = router;