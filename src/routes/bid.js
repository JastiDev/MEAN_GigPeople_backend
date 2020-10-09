const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Bid = require("../models/Bid");
const Task = require("../models/Task");

router.post("", checkAuth, async (req, res, next) => { 
  let { taskId, budget, duration, description } = req.body;

  try { 
    const oldBids = await Bid.find({ refTask: taskId, refBidder: req.userData.userId });
    if (oldBids.length > 0) return res.status(400).json({ message: "Already placed bid" });

    let bid = new Bid({
      refTask: taskId,
      refBidder: req.userData.userId,
      description: description,
      budget: budget,
      duration: duration,
    });

    let task = await Task.findById(taskId);
    if (!task) return res.status(400).json({ message: "Task not found" });
    task.refBids.unshift(bid._id);
    await task.save();
    await bid.save();

    return res.status(200).json(bid);
  } catch (err) { 
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

router.post("/readByTaskId", checkAuth, (req, res, next) => { 
  let {taskId} = req.body;
  Bid.find({ taskId: taskId }).then(bids => { 
    res.status(200).json(bids);
  }).catch(err => { 
    console.log(err);
    res.status(500).json({ message: "Server Internel Error!" });
  });
});

router.post("/deleteOne", checkAuth, async (req, res, next) => {
  let userId = req.userData.userId;
  try { 
    const bid = await Bid.findById(req.body.id);
    if (!bid) return res.status(404).json({ message: "Can't find the bid." });
    if (bid.refBidder.toString() !== userId) return res.status(400).json({ message: "Only creator is allowed." });

    await Task.findByIdAndUpdate(bid.refTask, { '$pull': { 'refBids': bid._id } });
    await Bid.findByIdAndDelete(req.body.id);

    return res.status(200).json({ message: "Deleted one bid." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }

});


router.get("/myActiveBids", checkAuth, async (req, res, next) => { 
  let userId = req.userData.userId;
  try {
    const bids = await Bid.find({ refBidder: userId }).populate("refTask");
    return res.status(200).json(bids);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

router.put("", checkAuth, async (req, res, next) => {
  let { id, budget, duration, description } = req.body;
  let userId = req.userData.userId;
  try {
    const bid = await Bid.findById(id);
    bid.budget = budget;
    bid.duration = duration;
    bid.description = description;
    await bid.save();
    return res.status(200).json(bid);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
