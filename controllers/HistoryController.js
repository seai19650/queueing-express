const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish

const getHistory = async (req, res) => {
    const results = await Result.findAll({
        limit: 10,
        include: [
            {
                model: Progress,
                as: "progresses"
            },
            {
                model: Request,
                as: "request"
            }
        ],
        order: [
            ['createdAt', 'DESC'],
            [{model: Request, as: 'request'}, 'createdAt', 'DESC']
        ]
    })
    results.map(result => result.request.documents = (JSON.parse(result.request.documents)))
    res.status(200).json(results)
}

module.exports = {
    getHistory
}
