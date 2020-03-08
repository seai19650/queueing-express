const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()
const api = require("../api")

const getRequests = (req, res) => {

    let isLastPage = false
    let page = req.query.page !== undefined ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize !== undefined ? parseInt(req.query.pageSize) : 10

    const offset = (Math.max(page-1, 0)) * pageSize

    Request.findAll({
        limit: pageSize,
        offset: offset,
        include: [
            {
                model: Progress,
                as: 'progresses'
            },
            {
                model: Result,
                as: 'result'
            }
        ],
        order: [
            ['created_at', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'created_at', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'id', 'DESC'],
            [{model: Result, as: 'result'}, 'created_at', 'DESC']
        ]
    }).then(requests => {
        requests.forEach(request => {
            if (request.id === 1) {
                isLastPage = true
            }
            request.set("documents", JSON.parse(request.get("documents")))
            request.progresses.forEach(progress => {
                progress.setDataValue("status", api.getStatusMessage(progress.get('status_code'), progress.get('payload').split(",")))
                delete progress.payload
            })
            if (request.result !== null) {
                request.result = formatResultOutput(request.result)
            }
        })

        let pagination = {}
        if (requests.length === pageSize && !isLastPage) {
            pagination['next'] = `?page=${page+1}&pageSize=${pageSize}`
        }
        if (page > 1) {
            pagination['previous'] = `?page=${page-1}&pageSize=${pageSize}`
        }

        res.status(200).json({
            data: requests,
            pagination: pagination
        })
    })
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
            targetedRequest.result = formatResultOutput(targetedRequest.result)
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

function formatResultOutput (result) {
    let resultToJson = ['topic_chart_url',
        'term_topic_matrix',
        'document_topic_matrix',
        'topic_stat', 'term_pairs',
        'unreadable_documents']
    resultToJson.forEach(key => {
        result[key] = JSON.parse(result[key])
        delete result[key]['id']
        delete result[key]['request_id']
        delete result[key]['updated_at']
    })
    delete result['id']
    delete result['request_id']
    delete result['updated_at']
    return result
}

module.exports = {
    getRequests,
    getRequestByProjectId,
    pushToQueue
}
