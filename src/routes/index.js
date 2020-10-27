var express = require('express');
var router = express.Router();
const userRouter = require('./user');
const workerProfileRouter = require("./worker_profile");
const employerProfileRouter = require("./employer_profile");
const {financialProfileRouter} = require("./financial_profile");

const employerReviewRouter = require("./employer_review");
const workerReviewRouter = require("./worker_review");

const taskRouter = require('./task');
const bidRouter = require('./bid');
const contractRouter = require('./contract');
const categoryRouter = require("./category");
const skillRouter = require("./skill");

router.use('/user', userRouter);
router.use("/worker_profile", workerProfileRouter);
router.use("/employer_profile", employerProfileRouter);
router.use("/financial_profile", financialProfileRouter);

router.use('/employer_review', employerReviewRouter);
router.use('/worker_review', workerReviewRouter);

router.use('/task', taskRouter);
router.use('/bid', bidRouter);
router.use("/contract", contractRouter);

router.use("/category", categoryRouter);
router.use("/skill", skillRouter);


module.exports = router;
