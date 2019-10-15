const jwt = require("jwt-simple")
const passport = require("passport")
const User = require("../models").User

const SECRET = "Demmy"

const login = async (req, res, next) => {
  passport.authenticate("local", {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something went wrong",
        user: user
      })
    }
    req.login(user, {session: false}, (err) => {
      if (err) {
        res.send(err)
      }
    })
    delete user.password
    const token = jwt.encode(user, SECRET)
    return res.json({user, token})
  })(req, res)
}

const register = async (req, res, next) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then((user) => {
    if (user) {
      res.send(user)
    } else {
      res.status(400).send("Error creating new User")
    }
  })
}

module.exports = {login, register}