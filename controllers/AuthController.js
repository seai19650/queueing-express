const express = require("express")
const Sequelize = require('sequelize')
const publish = require("../rabbitmq").publish
const jwt = require("jsonwebtoken")

const redis = require("redis")
const redisClient = require('../redis').getRedisClient()
const randtoken = require('rand-token')

const User = require("../models").User

const SECRET = "DEMMY"

const doRegister = async (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        isAdmin: true
    }).then(user => {
        delete user.password
        res.status(201).json(user)
    })
}

const doLogin = async (req, res) => {
    const payload = {
        sub: req.body.username,
        iat: new Date().getTime()/1000,
        isAdmin: req.userData.isAdmin
    }
    let refreshToken = randtoken.uid(256)

    redisClient.set(req.body.username, refreshToken)

    res.status(200).json({
        username: req.body.username,
        token: jwt.sign(payload, SECRET, {expiresIn: '30m'}),
        refreshToken: refreshToken
    })
}

const getUserData = async (req, res) => {
    res.status(200).json({
        user: {
            username: jwt.decode(req.headers.authorization.split(" ")[1], SECRET)['sub'],
        }
    })
}

module.exports = {
    doRegister,
    doLogin,
    getUserData
}
