const JwtExtract = require("passport-jwt").ExtractJwt
const JwtStrategy = require("passport-jwt").Strategy
const passport = require("passport")

const SECRET = "DEMMY"

const jwtOptions = {
    jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

const jwtAuthentication = new JwtStrategy(jwtOptions, (payload, done) => {
    if(payload.is_admin) done(null, true);
    else done(null, false);
})

passport.use(jwtAuthentication)

module.exports = passport