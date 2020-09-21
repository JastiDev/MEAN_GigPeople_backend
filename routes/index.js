var express = require('express');
var router = express.Router();
const userRouter = require('./user');
const taskRouter = require('./task');
const bidRouter = require('./bid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/user/', userRouter);
router.use('/api/task/', taskRouter);
router.use('/api/bid', bidRouter);
module.exports = router;
