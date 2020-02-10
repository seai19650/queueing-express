const User = require("../models").User

const requireLoginAuthentication = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            console.log("User Found")
            if (user.validPassword(req.body.password)) {
                req.userData = user
                next()
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

const requireJwtAuthentication = (req, res, next) => require("../passport")
    .authenticate("jwt", {session: false})(req, res, next)

module.exports = {
    requireLoginAuthentication,
    requireJwtAuthentication
}