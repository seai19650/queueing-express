const User = require("./models").User
const passport = require("passport")
const localStrategy = require("passport-local").Strategy

const localStrategyConfig = new localStrategy(
  function (username, password, cb) {
    User.findOne({where:{username: username}}).then(function (user) {
      if (!user) return cb(null, false, {message: "Incorrect username."})
      if (!user.validPassword(password)) return cb(null, false, {message: "Invalid password."})
      return cb(null, user.dataValues)
    })
  }
)

const passportJWT = require("passport-jwt")
const jwtStrategy = passportJWT.Strategy
const jwtExtract = passportJWT.ExtractJwt
const SECRET = "Demmy"

const jwtStrategyConfig = new jwtStrategy(
  {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
  },
  function (payload, cb) {
    return cb(null, payload)
  }
)

passport.use(localStrategyConfig)
passport.use(jwtStrategyConfig)