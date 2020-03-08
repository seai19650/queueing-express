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

    if (req.body.data) {
        req.body.data = JSON.parse(req.body.data.replace(/'/g, '"'))
    }

    if (typeof req.body.payload === "string") {
        req.body.payload = [req.body.payload]
    }

    console.log(` ==> [${req.body.id}] : ${req.body.code} "${api.getStatusMessage(req.body.code, req.body.payload)}"`)

    let progress = {
        request_id: req.body.id,
        status_code: req.body.code,
        payload: req.body.payload.toString(),
    }

    if (req.body.keep) {
        console.log(" ===> [Save] Progress")
        Progress.create(progress)
    }

    if (progress.status_code === '192') {
        Result.create({
            request_id: req.body.id,
            topic_chart_url: JSON.stringify(req.body.data.topic_chart_url),
            term_topic_matrix: JSON.stringify(req.body.data.term_topic_matrix),
            document_topic_matrix: JSON.stringify(req.body.data.document_topic_matrix),
            topic_stat: JSON.stringify(req.body.data.topic_stat),
            term_pairs: JSON.stringify(req.body.data.term_pairs),
            unreadable_documents: JSON.stringify(req.body.data.unreadable_documents),
            undownloadable_documents: JSON.stringify(req.body.data.undownloadable_documents)
        })
    }

    progress.status = api.getStatusMessage(req.body.code, req.body.payload)
    io.emit('progress', {'payload': progress})
    if (progress.status_code === '050') {
        io.emit('history', {'payload': progress})
    }

    // temporary store this progress in the latest progresses list
    latestProgresses[req.body.id] = progress
    if (Object.keys(latestProgresses).length > 50) {
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
