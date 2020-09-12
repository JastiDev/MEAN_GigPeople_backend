var express = require('express');
var router = express.Router();
const userRouter = require('./user');
const taskRouter = require('./task');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/user/', userRouter);
router.use('/api/task/', taskRouter);

module.exports = router;
