const User = require("../models").User

const getAllUsers = async (req, res) => {
    res.status(200).json(await User.scope('withoutPassword').findAll())
}

const activateUser = async (req, res) => {
    User.update({
        is_admin: true
    }, {
        where: {
            id: req.params.id
        }
    }).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        console.log(err)
    })
}

const deactivateUser = async (req, res) => {
    User.update({
        is_admin: false
    }, {
        where: {
            id: req.params.id
        }
    }).then(user => {
        res.status(200).json(user)
    }).catch(err => {
        console.log(err)
    })
}

module.exports = {
    getAllUsers,
    activateUser,
    deactivateUser
}
