const express = require("express");
const multer = require("multer");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Task = require("../models/Task");


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "public/userfiles");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("myfile"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    const taskData = JSON.parse(req.body.taskData);
    delete taskData._id;
    taskData.filePath = url + "/userfiles/" + req.file.filename;
    taskData.creatorId = req.userData.userId;
    
    const task = new Task(taskData);

    task.save().then(createdTask => {
      res.status(201).json({task: createdTask});
    });

  }
);

router.get("/:id", (req, res, next) => {
  Task.findById(req.params.id).then(task => {
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.post("/readbyfilter", (req, res, next) => { 
  Task.find().then(tasks => {
    res.status(200).json(tasks);
  }).catch(err => { 
    console.log(err);
    res.status(500).json({ message: "Server Internel Error!" });
  });
});

module.exports = router;