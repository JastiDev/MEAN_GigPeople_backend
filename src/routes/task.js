const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Bid = require("../models/Bid");
const Task = require("../models/Task");

const { fsNotif } = require("../myfirebase");
const { Notif_Type, Task_Status, Contract_Status } = require("../common/enums");
const Contract = require("../models/Contract");
const User = require("../models/User");

router.post(
  "",
  checkAuth,
  async (req, res, next) => {
    try { 
      const task = new Task({
        refCreator: req.userData.userId,
        ...req.body,
        // title: req.body.title,
        // description: req.body.description,
        // refCategory: req.body.refCategory,
        // country: req.body.country,
        // minBudget: req.body.minBudget,
        // maxBudget: req.body.maxBudget,
        // refSkills: req.body.refSkills,
        // isHourly: req.body.isHourly,
        // filePath: req.body.filePath,
      });

      const createdTask = await task.save();
      res.status(201).json({ task: createdTask });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Error" });
    }
  }
);

router.put("", checkAuth, async (req, res, next) => {
  try {
    const task = await Task.findById(req.body._id);
    if (!task) return res.status(404).json({ message: "Task not found!" });

    task.title = req.body.title;
    task.description = req.body.description;
    task.refCategory = req.body.refCategory;
    task.country = req.body.country;
    task.minBudget = req.body.minBudget;
    task.maxBudget = req.body.maxBudget;
    task.refSkills = req.body.refSkills;
    task.isHourly = req.body.isHourly;
    task.filePath = req.body.filePath;

    const createdTask = await task.save();
    res.status(200).json({ task: createdTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error" });
  }
});

router.get("/:id", (req, res, next) => {
  Task
    .findById(req.params.id)
    .then(task => {
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({ message: "Task not found!" });
      }
    });
});

router.post("/readbyfilter", (req, res, next) => { 
  Task.find()
    .populate("refCategory")
    .populate("refSkills")
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internel Error!" });
    });
});


router.post("/readOneWithRefs", async (req, res, next) => { 
  try { 

    if (
      req.body.refs.indexOf("refCreator") > -1 &&
      req.body.refs.indexOf("refSkills") > -1 &&
      req.body.refs.indexOf("refBids_refBidder") > -1 &&
      req.body.refs.indexOf("refContract") > -1 &&
      req.body.refs.length === 4
    ) {
      const task = await Task.findById(req.body.id)
        .populate("refCreator")
        .populate("refSkills")
        .populate({ path: 'refBids', populate: { path: 'refBidder' } })
        .populate("refContract");
      if (!task) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(task);
      
    } else {
      return res.status(400).json({ message: "Bad Request" });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
  }
});

router.post("/readMyTasks", checkAuth, async (req, res, next) => { 
  const userId = req.userData.userId;

  try { 
    const tasks = await Task.find({ refCreator: userId, status: req.body.status }).populate("refBids");
    return res.status(200).json(tasks);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
  }
});

router.post("/delete", checkAuth, async (req, res, next) => { 
  const userId = req.userData.userId;
  try {
    await Bid.remove({ refTask: req.body.id });
    await Task.findByIdAndDelete(req.body.id);
    return res.status(200).json({ message: "Successfully removed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internel Error!" });
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
      duration: req.body.duration
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
    return res.status(200).json({contract});
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


module.exports = router;