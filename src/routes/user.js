const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

/* GET users listing. */
router.post('/signup', function (req, res, next) {
  bcrypt.hash(req.body.password, 10).then(hash => { 
    const user = new User({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      country: req.body.country
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });

});

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
        { expiresIn: "3h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
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

module.exports = router;
