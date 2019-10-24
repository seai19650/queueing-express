const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models").User;

const SECRET = "Demmy";

const login = async (req, res, next) => {
  // console.log(req.body)
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(404).json({
        message: "Something went wrong"
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
    });
    const signOptions = {
      issuer: "Queue API",
      subject: "queue",
      audience: user.username,
      expiresIn: "15m"
    };

    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    var token = jwt.sign(user, SECRET, signOptions);
    return res.json({ token: token });
  })(req, res);
};

const register = async (req, res, next) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => {
    if (user) {
      res.send(user);
    } else {
      res.status(400).send("Error creating new User");
    }
  });
};

module.exports = { login, register };
