const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const request = require("request")

const getQueue = async (req, res) => {

  if (process.env.RABBITMQ_HOST) {
    rabbitmq_url = `${process.env.RABBITMQ_HOST}:15672`
  } else {
    rabbitmq_url = "queueing-rabbitmq:15672"
  }

  request.post(
    {
      auth: {
        user: 'ml-rabbitmq',
        pass: 'passwordpala',
        sendImmediately: false
      },
      headers: {
        'content-type': 'application/json'
      },
      url: `http://${rabbitmq_url}/api/queues/%2f/processing.requests/get`,
      body: {"count": 100, "requeue": true, "encoding": "auto", "truncate": 50000, "ackmode": "ack_requeue_true"},
      json: true
    },
    (error, response, body) => {

      if (error) {
        res.status(500).send()
      } else {
        if (body && body.length) {
          body.map(task => {
            task.payload = JSON.parse(task.payload)
            task.payload.documents = JSON.parse(task.payload.documents)
          })
        }
        res.status(200).json({
          data: body
        })
      }

    }
  )
}

module.exports = {
  getQueue
}
