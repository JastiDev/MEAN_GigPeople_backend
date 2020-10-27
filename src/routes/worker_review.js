const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// const User = require("../models/User");
const WorkerReview = require("../models/WorkerReview");

router.post("/readByTaskId", async (req, res, next) => {
  try {
    const review = await WorkerReview.findOne({ refTask: req.body.taskId });
    res.status(200).json(review);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error" });
  }
});


router.post("", async (req, res, next) => {
  let x = req.body.review;
  try {
    delete x._id;
    delete x.timestamp;
    const y = await WorkerReview.findOne({ refTask: x.refTask });
    if (y) return res.status(401).json({ message: "Already Exist!" });

    const z = new WorkerReview(x);
    await z.save();

    return res.status(200).json(z);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
