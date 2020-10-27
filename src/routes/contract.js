const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const { fsNotif } = require("../myfirebase");
const { Notif_Type, Task_Status, Contract_Status } = require("../common/enums");
const Contract = require("../models/Contract");
const User = require("../models/User");
const Bid = require("../models/Bid");
const Task = require("../models/Task");

const { updateBalance } = require('./financial_profile');

router.get('', async (req, res, next) => { 
  try { 
    let arr = await Contract.find();
    return res.status(200).json(arr);
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Internal error."});
  }
});

router.post("/awardBid", checkAuth, async (req, res, next) => {
  const userId = req.userData.userId;
  const { taskId, bidId, workerId, employerId } = req.body;
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
    if (arr.length > 0) return res.status(200).json(contract);

    let contract = new Contract({
      refEmployer: req.body.employerId,
      refWorker: req.body.workerId,
      refTask: req.body.taskId,
      budget: req.body.budget,
      isHourly: req.body.isHourly,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      duration: req.body.duration,
    });

    let task = await Task.findById(taskId);
    task.refContract = contract._id;

    await contract.save();
    await task.save();
    // notification
    fsNotif.add({
      userId: workerId,
      timestamp: Date.now(),
      text: "Your Bid Awarded!",
      type: Notif_Type.AWARD_BID,
      data: { taskTitle: task.title, taskId, bidId, employerId },
      isRead: false,
    });
    return res.status(200).json({ contract });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
  }
});

router.post("/acceptContract", checkAuth, async (req, res, next) => {
  const userId = req.userData.userId;
  try {
    let contract = await Contract.findById(req.body.idContract);
    contract.status = Contract_Status.STARTED;
    await contract.save();

    let task = await Task.findById(contract.refTask);
    let worker = await User.findById(contract.refWorker);

    let taskId = JSON.stringify(task._id).split('"')[1];
    let employerId = JSON.stringify(contract.refEmployer).split('"')[1];
    // notification
    fsNotif.add({
      userId: employerId,
      timestamp: Date.now(),
      text: `Contract for task ${task.title} agreed by the freelancer ${worker.firstName} ${worker.lastName}.`,
      type: Notif_Type.CONTRACT_AGREED,
      data: { taskId, employerId },
      isRead: false,
    });
    return res.status(200).json(contract);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
  }
});


router.post("/release", checkAuth, async (req, res, next) => {
  const userId = req.userData.userId;
  try {
    let contract = await Contract.findById(req.body.idContract);
    contract.status = Contract_Status.RELEASED;
    await contract.save();

    let task = await Task.findById(contract.refTask);
    let employer = await User.findById(contract.refEmployer);
    
    let delta = contract.isHourly ? contract.budget * contract.duration * 24 : contract.budget;
    await updateBalance(contract.refEmployer, -delta);
    await updateBalance(contract.refWorker, delta);

    let taskId = JSON.stringify(task._id).split('"')[1];
    let workerId = JSON.stringify(contract.refWorker).split('"')[1];
    // notification
    fsNotif.add({
      userId: workerId,
      timestamp: Date.now(),
      text: `${delta} USD is released by ${employer.firstName} ${employer.lastName} for the task "${task.title}".`,
      type: Notif_Type.RELEASED,
      data: { taskId, workerId },
      isRead: false,
    });
    return res.status(200).json(contract);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
  }
});

module.exports = router;