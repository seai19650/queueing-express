const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()
const api = require("../api")
const fs = require("fs")

const getRequests = (req, res) => {

    let isLastPage = false
    let page = req.query.page !== undefined ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize !== undefined ? parseInt(req.query.pageSize) : 50

    const offset = (Math.max(page-1, 0)) * pageSize

    Request.findAll({
        limit: pageSize,
        offset: offset,
        include: [
            {
                model: Progress,
                as: 'progresses'
            }
        ],
        order: [
            ['id', 'DESC'],
            ['created_at', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'created_at', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'id', 'DESC']
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
            // {
            //     model: Result,
            //     as: "result"
            // }
        ]
    }).then(targetedRequest => {
        if (targetedRequest !== null) {
            targetedRequest = targetedRequest.get({plain:true})
            targetedRequest.documents = JSON.parse(targetedRequest.documents)
            targetedRequest.progresses.map(progress => {
                progress['status'] = api.getStatusMessage(progress['status_code'], progress['payload'])
                delete progress['payload']
                delete progress['id']
                delete progress['request_id']
                delete progress['updated_at']
            })
            res.status(200).json(targetedRequest)
        } else {
            res.status(404).json({
                message: `Project ID ${req.params.project_id} does not present on the database.`
            })
        }
    })
}

const getRequestByProjectName = (req, res) => {
    Request.findAll({
        where: {
            project_name: {
                [Sequelize.Op.like]: `%${req.params.project_name}%`
            }
        },
        include: [
            {
                model: Progress,
                as: "progresses"
            },
            // {
            //     model: Result,
            //     as: "result"
            // }
        ]
    }).then(targetedRequests => {
        if (targetedRequests !== null) {
            targetedRequests.forEach(targetedRequest => {
                targetedRequest.set('documents', JSON.parse(targetedRequest.get('documents')))
                targetedRequest = targetedRequest.get({plain:true})
                targetedRequest.progresses.map(progress => {
                    progress['status'] = api.getStatusMessage(progress['status_code'], progress['payload'])
                    delete progress['payload']
                    delete progress['id']
                    delete progress['request_id']
                    delete progress['updated_at']
                })
            })
            res.status(200).json(targetedRequests)
        } else {
            res.status(404).json({
                message: `Project Name contains "${req.params.project_name}" does not present on the database.`
            })
        }
    })
}

const pushToQueue = async (req, res) => {

    // Make new request payload
    let newRequest = {
        project_id: req.body.project_id,
        project_name: req.body.project_name,
        documents: JSON.stringify(req.body.documents),
    }

    if (!isAcceptRequestFormat(newRequest)) {
        console.log("Not ok")
        res.status(400).json({
            message: 'Required Parameter not found or in wrong format'
        })
    } else {

        if (req.body.criteria !== undefined) {
            newRequest.criteria = parseInt(req.body.criteria)
        }
        if (req.body.max_no_topic !== undefined) {
            newRequest.max_no_topic = parseInt(req.body.max_no_topic)
        }

        // Store this new request into database
        Request.create(newRequest).then(request => {
            if (request.get("criteria") === null) {
                request.set("criteria", "None")
            }

            // Sent To RabbitMQ
            publish("", "processing.requests", new Buffer.from(JSON.stringify(request.get({plain:true}))))

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
}

const deleteRequestById = async (req, res) => {
    Request.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Result,
                as: "result",
                attributes: ['topic_chart_url']
            }
        ]
    }).then(request => {
        const fileToDelete = request.result !== null ? JSON.parse(request.result.topic_chart_url).th : null
        if (fileToDelete !== null) {
            fs.unlink(`${__dirname}/../outputs/${fileToDelete}`, err => {
                if (err) {
                    console.log(err)
                } else {
                    Request.destroy({
                        where: {
                            id: req.params.id
                        },
                    })
                    res.status(200).json({
                        message: `Project as ID ${req.params.id} has been deleted with all its data.`,
                        fileState: `deleted`
                    })
                }
            })
        } else {
            Request.destroy({
                where: {
                    id: req.params.id
                },
            })
            res.status(200).json({
                message: `Project as ID ${req.params.id} has been deleted with all its data.`,
                fileState: `file not exist`
            })
        }
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

function isAcceptRequestFormat(payload) {
    return !((payload['project_id'] === undefined || payload['project_id'] === "") ||
      (payload['project_name'] === undefined || payload['project_name'] === "") ||
      (payload['documents'] === undefined || payload['documents'] === ""));

}

module.exports = {
    getRequests,
    getRequestByProjectId,
    getRequestByProjectName,
    pushToQueue,
    deleteRequestById
}
