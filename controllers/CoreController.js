const User = require("../models").User

const doRootRegister = async (req, res) => {
    const adminCount = await User.count({where: {is_admin: true}})
    if (!adminCount) {
        User.create({
            username: "root",
            password: req.body.password,
            is_admin: true
        }).then(user => {
            delete user.password
            res.status(201).json(user)
        })
    } else {
        res.status(403).json({
            message: "Root account is already set"
        })
    }
}

module.exports = {
    doRootRegister
}
