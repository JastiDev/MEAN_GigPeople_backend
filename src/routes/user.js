const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require("multer");
var multerGoogleStorage = require("multer-google-storage");

const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");
const EmployerProfile = require("../models/EmployerProfile");
const FinancialProfile = require("../models/FinancialProfile");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

/* GET users listing. */
router.post('/signup', async (req, res, next) => {
  try { 
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      country: req.body.country,
    });

    let result = await user.save();
    const refWorkerProfile = await create_worker_profile(result._id);
    const refEmployerProfile = await create_employer_profile(result._id);
    const refFinancialProfile = await create_financial_profile(result._id);
    
    result.refWorkerProfile = refWorkerProfile;
    result.refEmployerProfile = refEmployerProfile;
    result.refFinancialProfile = refFinancialProfile;
    result = await result.save();

    res.status(201).json({ message: "User created!", result: result});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

const create_worker_profile = async (refUser) => {
  const profile = new WorkerProfile({
    refUser: refUser,
    refSkills: [],
    refWorkerReviews: [],
    hourlyRate: 50,
    title: "",
    description: "",
    refTasks: [],
    refBids: []
  });
  let result = await profile.save();
  return result._id;
};

const create_employer_profile = async (refUser) => { 
  const profile = new EmployerProfile({
    refUser: refUser,
    refEmployerReviews: [],
    refTasks: [],
    title: "",
    description: "",
  });
  let result = await profile.save();
  return result._id;
}

const create_financial_profile = async () => {
  const profile = new FinancialProfile({
    balance: 0,
    refTransactions: [],
  });
  let result = await profile.save();
  return result._id;  
}

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) return false
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 24*3600,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed",
      });
    });
});

router.get("/me", checkAuth, async (req, res, next) => { 
  try { 
    const me = await User.findById(req.userData.userId);
    res.status(200).json(me);
  } catch (err) { 
    console.log(err);
    res.status(404).json({ message: "You are not verified as you." });
  }
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "public/userfiles/avatar");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(" ").join("-");

//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   },
// });


const storage = multerGoogleStorage.storageEngine({
  bucket: process.env.GCS_BUCKET,
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: process.env.GCS_KEYFILE,
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-").split("@").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
  autoRetry: true,
  maxRetries: 3
});

router.put(
  "/me",
  checkAuth,
  multer({ storage: storage }).single("myfile"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      // const url = req.protocol + "://" + req.get("host");

      let me = await User.findById(req.userData.userId);
      me.firstName = req.body.firstName;
      me.lastName = req.body.lastName;
      me.email = req.body.email;
      me.country = req.body.country;
      // me.avatar = url + "/userfiles/avatar/" + req.file.filename;
      me.avatar = req.file.path;
      await me.save();
      res.status(200).json(me);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "You are not verified as you." });
    }
  }
);

router.post("/getById", async (req, res, next) => { 
  try {
    let user = await User.findById(req.body.id);
    if (!user) res.status(404).json({ message: "User Not Found" });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
