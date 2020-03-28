const express = require("express")
const sequelize = require("../models").sequelize
const User = require("../models").User
const request = require("request")
const redisClient = require('../redis').getRedisClient()

let workers = {}

setInterval(() => {
  Object.keys(workers).forEach(worker_id => {
    if (new Date().getTime()/1000 - workers[worker_id] > 5) {
      delete workers[worker_id]
    }
  })
}, 12000)

const getCoreHealth = async (req, res) => {
  const adminCount = await User.count({
    where: {
      is_admin: true
    }
  })
  if (adminCount > 0) {
    res.status(200).json({
      isHealthy: true,
      status_code: 200,
      message: "Core system is working"
    })
  } else {
    res.status(200).json({
      isHealthy: false,
      status_code: 500,
      message: "Initialize setup is needed"
    })
  }
}

const getDatabaseHealth = async (req, res) => {
  sequelize
    .authenticate()
    .then(() => {
      res.status(200).json({
        isHealthy: true,
        status_code: 200,
        message: "Connection has been established successfully."
      })
    })
    .catch(err => {
      res.status(200).json({
        isHealthy: false,
        status_code: 503,
        message: `Unable to connect to the database:'${err}`
      })
    });
}

const getWorkerHealth = async (req, res) => {
  if (Object.keys(workers).length > 0) {
    res.status(200).json({
      isHealthy: true,
      status_code: 200,
      message: `Worker section is working`,
      workers: workers
    })
  } else {
    res.status(200).json({
      isHealthy: true,
      status_code: 503,
      message: `Worker section is not working`
    })
  }
}

const handleWorkerHealth = async (req, res) => {
  workers[req.body.worker_id] = new Date().getTime()/1000

  res.status(204).send()
}

const getRabbitMqHealth = async (req, res) => {
  let rabbitmq_url
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
        res.status(200).json({
          isHealthy: false,
          status_code: 503,
          message: `RabbitMQ is not working`,
          response: response
        })
      } else {
        res.status(200).json({
          isHealthy: true,
          status_code: 200,
          message: `RabbitMQ is working`
        })
      }

    }
  )
}

module.exports = {
  getCoreHealth,
  getDatabaseHealth,
  getWorkerHealth,
  getRabbitMqHealth,
  handleWorkerHealth
}
