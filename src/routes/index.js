var express = require('express');
var router = express.Router();
const userRouter = require('./user');
const taskRouter = require('./task');
const bidRouter = require('./bid');

router.use('/user', userRouter);
router.use('/task', taskRouter);
router.use('/bid', bidRouter);
module.exports = router;
