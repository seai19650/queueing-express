const User = require("../models").User
const JwtExtract = require("passport-jwt").ExtractJwt

const requireLoginAuthentication = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            console.log("User Found")
            if (user.validPassword(req.body.password)) {
                if (user.get("is_admin")) {
                    req.userData = user
                    next()
                } else {
                    console.log("Not Activate")
                    res.status(403).json({
                        message: 'Not Activate'
                    })
                }

            } else {
                console.log("Wrong Credential")
                res.status(401).json({
                    message: 'Wrong Credential'
                })
            }
        } else {
            console.log("User Not Found")
            res.status(404).json({
                message: 'User Not Found'
            })
        }
    })
}

const requireJwtAuthentication = (req, res, next) => {
    return require("../passport")
        .authenticate("jwt", {session: false})(req, res, next);
}

const requireServerTokenAuthentication = (req, res, next) => {
    const authKey = req.get("Authorization")
    if (authKey) {
        if (authKey === process.env.API_KEY) {
            next()
        } else {
            res.status(403).json({
                message: 'API Key is not accepted'
            })
        }
    } else {
        res.status(400).json({
            message: 'API Key is required'
        })
    }
}

module.exports = {
    requireLoginAuthentication,
    requireJwtAuthentication,
    requireServerTokenAuthentication
}