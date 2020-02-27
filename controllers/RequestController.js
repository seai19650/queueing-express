const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()
const api = require("../api")

const list = async (req, res) => {
    const payload = await Request.findAll({
        where: {id: req.params.id}
    })
    res.send(payload)
}

const getRequestByProjectId = (req, res) => {
    Request.findOne({
        where: {projectId: req.params.projectId},
        include: [
            {
                model: Progress,
                as: "progresses"
            }
        ]
    }).then(targetedRequest => {
        targetedRequest = targetedRequest.get({plain:true})
        targetedRequest.documents = JSON.parse(targetedRequest.documents)
        targetedRequest.progresses.map(progress => {
            progress['status'] = api.getStatusMessage(progress['statusCode'], progress['payload'])
            delete progress['payload']
        })
        res.status(200).json(targetedRequest)
    })
}

const pushToQueue = async (req, res) => {
    // make new request payload
    let newRequest = {
        projectId: req.body.projectId,
        documents: req.body.documents.toString()
    }

    // store this new request into database
    Request.create(newRequest).then(request => {

        publish("", "processing.requests",
            new Buffer.from(
                JSON.stringify({
                    id: request.id,
                    projectId: request.projectId,
                    documents: request.documents,
                    max_no_topic: req.body.max_no_topic
                })
            )
        )

        Progress.create({
            requestId: request.id,
            statusCode: "000",
            payload: request.id,
        })

        io.emit('request', {
            projectId: req.body.projectId,
            id: request.id
        })

        // send feedback
        res.status(201).json({
            projectId: req.body.projectId,
            id: request.id
        })
    }).catch(Sequelize.UniqueConstraintError, error => {
        res.status(409).json({
            projectId: req.body.projectId,
            status: `projectId(${req.body.projectId}) is not unique based on the API System.`
        })
    })
}

module.exports = {
    list,
    pushToQueue,
    getRequestByProjectId
}
