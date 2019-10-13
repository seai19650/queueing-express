const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// Authentication
const jwt = require('jwt-simple')
const passport = require('passport')
const extractJwt = require('passport-jwt').ExtractJwt
const jwtStrategy = require('passport-jwt').Strategy

const SECRET = "DEMMY"

const jwtOptions = {
    jwtFromRequest: extractJwt.fromHeader("Authorization"),
    secretOrKey: SECRET
}
const jwtAuth = new jwtStrategy(jwtOptions, (payload, done) => {
    if (payload.sub === "application") {
        done(null, true)
    } else {
        done(null, false)
    }
})

passport.use(jwtAuth);
const requireJWTAut = passport.authenticate("jwt", {session: false})

app.post("/jwt", (req, res) => {
    const payload = {
        sub: "application",
        iat: new Date().getTime()
    }
    res.send(jwt.encode(payload, SECRET));
})

const requests = require('./routes/requests')

app.use('/request', requireJWTAut, requests)

// db.Request.findOne({
//     subQuery: false,
//     where: {id: 1},
//     include: [{
//         model: db.Image,
//         as: 'images'
//     }]
// })
// .then(findedRequest => { console.log(findedRequest) })
// .catch(error => { console.log(error) })


app.listen(3000, () => {
    db.sequelize.sync()
    console.log('My Rest API running on port 3000!')
})