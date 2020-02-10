const express = require("express")
const Sequelize = require('sequelize')
const publish = require("../rabbitmq").publish
const jsonwebtoken = require("jsonwebtoken")

const User = require("../models").User

const jwt = require("jsonwebtoken")

const SECRET = "DEMMY"

const doRegister = async (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        is_admin: false
    }).then(user => {
        delete user.password
        res.status(201).json(user)
    })
}

const doLogin = async (req, res) => {
    const payload = {
        sub: req.body.username,
        iat: new Date().getTime(),
        is_admin: req.userData.is_admin
    }
    res.status(200).json({
        username: req.body.username,
        token: jwt.sign(payload, SECRET)
    })
}

const getUserData = async (req, res) => {
    res.status(200).json({
        user: {
            username: req.body.username
        }
    })
}

module.exports = {
    doRegister,
    doLogin,
    getUserData
}
