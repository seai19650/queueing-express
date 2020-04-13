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
        is_admin: false
    }).then(user => {
        delete user.password
        res.status(201).json(user)
    })
}

const doLogin = async (req, res) => {
    const payload = {
        sub: req.body.username,
        iat: new Date().getTime()/1000,
        is_admin: req.userData.is_admin
    }

    res.status(200).json({
        username: req.body.username,
        token: jwt.sign(payload, SECRET, {expiresIn: '5m'})
    })
}

const doRefreshToken = async (req, res) => {
    let decodedToken = jwt.decode(req.headers.authorization.split(" ")[1], SECRET)
    redisClient.get(decodedToken['sub'], (error, data) => {
        if (data !== null && req.body.refresh_token === data) {
            const payload = {
                sub: decodedToken['sub'],
                iat: new Date().getTime()/1000,
                is_admin: true
            }
            res.status(200).json({
                username: decodedToken['sub'],
                token: jwt.sign(payload, SECRET, {expiresIn: '5m'}),
                refresh_token: boundWithRefreshToken(decodedToken['sub'])
            })
        } else {
            res.status(401).json({
                status: "Refresh Token is not valid"
            })
        }
    })
}

const getUserData = async (req, res) => {

    let decodedToken = jwt.decode(req.headers.authorization.split(" ")[1], SECRET)
    let payload = {
        user: {
            username: decodedToken['sub'],
            exp: decodedToken['exp'],
            refresh_token: boundWithRefreshToken(decodedToken['sub'])
        }
    }
    console.log(payload)
    res.status(200).json(payload)
}

function boundWithRefreshToken(username) {
    let refreshToken = randtoken.uid(256)
    redisClient.set(username, refreshToken)
    return refreshToken
}

module.exports = {
    doRegister,
    doLogin,
    getUserData,
    doRefreshToken
}
