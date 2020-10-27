const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");


// const User = require("../models/User");
const FinancialProfile = require("../models/FinancialProfile");

router.get("/me", checkAuth, async (req, res, next) => {
  try {
    console.log(req.userData.userId);
    let me = await FinancialProfile.findOne({ refUser: req.userData.userId });
    if (me === null) {
      me = new FinancialProfile({
        refUser: req.userData.userId,
        balance: 0,
        refTransactions: []
      });
      await me.save();
    }

    res.status(200).json(me);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "You are not verified as you." });
  }
});

router.put("/me", checkAuth, async (req, res, next) => {
  try {
    const me = await FinancialProfile.findOne({ refUser: req.userData.userId });

    await me.save();
    res.status(200).json(me);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "You are not verified as you." });
  }
});


const updateBalance = async (userId, delta) => { 
  const profile = await FinancialProfile.findOne({ refUser: userId });
  if (profile) {
    profile.balance += delta;
    await profile.save();
  }
};

module.exports = { financialProfileRouter: router, updateBalance };
