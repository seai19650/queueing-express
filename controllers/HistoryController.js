const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const api = require("../api")

const getHistory = (req, res) => {
    Result.findAll({
        limit: 10,
        include: [
            {
                model: Progress,
                as: 'progresses'
            },
            {
                model: Request,
                as: 'request'
            }
        ],
        order: [
            ['createdAt', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'createdAt', 'DESC'],
            [{model: Progress, as: 'progresses'}, 'id', 'DESC'],
            [{model: Request, as: 'request'}, 'createdAt', 'DESC']
        ]
    }).then(results => {
        results.forEach(result => {
            result = result.get({plain:true})
            result.request.documents = (JSON.parse(result.request.documents))
            result.progresses.forEach(progress => {
                progress.status = api.getStatusMessage(progress.status_code, progress.payload.split(","))
                delete progress.payload
            })
        })
        res.status(200).json({
            data: results
        })
    })
}

module.exports = {
    getHistory
}
