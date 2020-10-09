var express = require('express');
var router = express.Router();
const userRouter = require('./user');
const workerProfileRouter = require("./worker_profile");
const employerProfileRouter = require("./employer_profile");
const taskRouter = require('./task');
const bidRouter = require('./bid');
const categoryRouter = require("./category");
const skillRouter = require("./skill");

router.use('/user', userRouter);
router.use("/worker_profile", workerProfileRouter);
router.use("/employer_profile", employerProfileRouter);

router.use('/task', taskRouter);
router.use('/bid', bidRouter);

router.use("/category", categoryRouter);
router.use("/skill", skillRouter);

module.exports = router;
