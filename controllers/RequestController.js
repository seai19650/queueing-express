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
        where: {project_id: req.params.project_id},
        include: [
            {
                model: Progress,
                as: "progresses"
            },
            {
                model: Result,
                as: "result"
            }
        ]
    }).then(targetedRequest => {
        targetedRequest = targetedRequest.get({plain:true})
        targetedRequest.documents = JSON.parse(targetedRequest.documents)
        targetedRequest.progresses.map(progress => {
            progress['status'] = api.getStatusMessage(progress['status_code'], progress['payload'])
            delete progress['payload']
            delete progress['id']
            delete progress['request_id']
            delete progress['updated_at']
        })
        if (targetedRequest.result !== null) {
            let resultToJson = ['term_topic_matrix', 'document_topic_matrix', 'topic_stat', 'term_pairs', 'unreadable_documents']
            resultToJson.forEach(key => {
                targetedRequest.result[key] = JSON.parse(targetedRequest.result[key])
                delete targetedRequest.result[key]['id']
                delete targetedRequest.result[key]['request_id']
                delete targetedRequest.result[key]['updated_at']
            })
            delete targetedRequest.result['id']
            delete targetedRequest.result['request_id']
            delete targetedRequest.result['updated_at']
        }
        res.status(200).json(targetedRequest)
    })
}

const pushToQueue = async (req, res) => {

    // Make new request payload
    let newRequest = {
        project_id: req.body.project_id,
        project_name: req.body.project_name,
        documents: req.body.documents.toString()
    }

    // Store this new request into database
    Request.create(newRequest).then(request => {

        // Sent To RabbitMQ
        publish("", "processing.requests",
            new Buffer.from(
                JSON.stringify({
                    id: request.id,
                    project_id: request.project_id,
                    project_name: request.project_name,
                    documents: request.documents,
                    max_no_topic: req.body.max_no_topic
                })
            )
        )

        // Make the first progress
        Progress.create({
            request_id: request.id,
            status_code: "000",
            payload: request.id,
        })

        // Notify Panel about change
        io.emit('request', {
            project_id: req.body.project_id,
            id: request.id
        })

        // send feedback
        res.status(201).json({
            project_id: req.body.project_id,
            id: request.id
        })
    }).catch(Sequelize.UniqueConstraintError, error => {
        res.status(409).json({
            project_id: req.body.project_id,
            status: `project_id(${req.body.project_id}) is not unique based on the API System.`
        })
    })
}

module.exports = {
    list,
    pushToQueue,
    getRequestByProjectId
}
