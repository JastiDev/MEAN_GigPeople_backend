const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const Contract = require("../models/Contract");

const admin = require("firebase-admin");
const fsNotif = admin.firestore().collection('notifications');

router.get('', async (req, res, next) => { 
  try { 
    let arr = await Contract.find();
    return res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Internal error."});
  }
});


router.post('/create', checkAuth, async (req, res, next) => {
  try { 
    const userId = req.userData.userId;
    if (userId !== req.body.employerId) {
      return res.status(400).json({ message: "AuthInfo Not Correct" });
    }

    const arr = await Contract.find({
      refEmployer: req.body.employerId,
      refWorker: req.body.workerId,
      refTask: req.body.taskId,
    });
    if(arr.length>0) return res.status(200).json(contract);

    let contract = new Contract({
      refEmployer: req.body.employerId,
      refWorker: req.body.workerId,
      refTask: req.body.taskId,
      budget: req.body.budget,
      isHourly: req.body.isHourly,
      deadline: req.body.deadline,
    });

    // notification
    fsNotif.add({
      userId: req.body.workerId,
      timestamp: Date.now(),
      text: "Contract Awarded!",
      type: NotifType.AWARD_BID,
      data: {idContract: contract._id},
      isRead: false,
    });

    await contract.save();
    return res.status(200).json(contract);
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Internal error."});
  }
});


module.exports = router;