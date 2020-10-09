const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Bid = require("../models/Bid");
const Task = require("../models/Task");

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
      req.body.refs.indexOf("refBids") > -1 &&
      req.body.refs.length === 3
    ) {
      const task = await Task.findById(req.body.id)
        .populate("refCreator")
        .populate("refSkills")
        .populate("refBids");
      if (!task) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(task);

    } else if (
      req.body.refs.length === 1 &&
      req.body.refs.indexOf("refBids_refBidder") > -1
    ) {
      const task = await Task.findById(req.body.id)
        .populate({ path: 'refBids', populate: { path: 'refBidder' } });     
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

router.post("/myTasks", checkAuth, async (req, res, next) => { 
  const userId = req.userData.userId;

  try { 
    const tasks = await Task.find({ refCreator: userId }).populate("refBids");
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

module.exports = router;