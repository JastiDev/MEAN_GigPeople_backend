const express = require("express");
const multer = require("multer");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const Task = require("../models/task");


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

    console.log(req.body.task);
    console.log(req.userData);
    console.log(req.file.filename);

    res.status(200).json({message: "OK"});
    // const task = new Task({
      
    // });

    // const post = new Post({
    //   title: req.body.title,
    //   content: req.body.content,
    //   imagePath: url + "/images/" + req.file.filename,
    //   creator: req.userData.userId
    // });
    // post.save().then(createdPost => {
    //   res.status(201).json({
    //     message: "Post added successfully",
    //     post: {
    //       ...createdPost,
    //       id: createdPost._id
    //     }
    //   });
    // });

  }
);

module.exports = router;