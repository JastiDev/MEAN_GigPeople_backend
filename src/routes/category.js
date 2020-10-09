const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get('', async (req, res, next) => { 
  try { 
    let arr = await Category.find();
    res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Internal error."});
  }
});

module.exports = router;