const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Bid = require("../models/Bid");

router.post("", checkAuth, async (req, res, next) => { 
  let {bidData} = req.body;

  delete bidData._id;
  bidData.bidderId = req.userData.userId;

  try { 
    const bids = await Bid.find({ bidderId: bidData.bidderId });
    if (bids.length > 0) return res.status(400).json({ message: "You have already placed bid." });
    const createdBid = await new Bid(bidData).save();
    return res.status(201).json(createdBid);
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
    if (bid.bidderId.toString() !== userId) return res.status(400).json({ message: "Only creator is allowed." });
    await Bid.deleteOne({ _id: bid._id });
    return res.status(200).json({ message: "Deleted one bid." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }

});

module.exports = router;
