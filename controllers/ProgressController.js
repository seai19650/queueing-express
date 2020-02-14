const express = require("express")
const Sequelize = require('sequelize')
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()
const api = require("../api")

let latestProgresses = {}

const handleProgressStatus = async (req, res) => {

    if (typeof req.body.payload === "string") {
        req.body.payload = [req.body.payload]
    }

    console.log(`== Progress Update from ${req.body.id} : ${req.body.code} ==`)
    console.log(api.getStatusMessage(req.body.code, req.body.payload))

    let progress = {
        requestId: req.body.id,
        statusCode: req.body.code,
        payload: req.body.payload.toString(),
    }

    if (req.body.keep === "True") {
        Progress.create(progress)
    }

    if (req.files) {
        Result.create({
            requestId: req.body.id,
            filename: req.files[0].filename
        })
        progress.filename = req.files[0].filename
    }

    progress.status = api.getStatusMessage(req.body.code, req.body.payload)
    io.emit('progress', {'payload': progress})
    if (progress.statusCode === '050') {
        io.emit('history', {'payload': progress})
    }

    // temporary store this progress in the latest progresses list
    latestProgresses[req.body.id] = progress
    if (Object.keys(latestProgresses).length > 50) {
        console.log("Progress Temp Shift")
        delete latestProgresses[Object.keys(latestProgresses).map(Number).sort()[0]]
    }

    res.status(204).send()

}

const getLatestProgresses = async (req, res) => {
    res.status(200).json({
        data: Object.keys(latestProgresses)
            .map(Number)
            .sort()
            .reverse()
            .map(progressId => latestProgresses[progressId])
    })
}

module.exports = {
    handleProgressStatus,
    getLatestProgresses
}
