const express = require("express")
const sequelize = require("../models").sequelize
const User = require("../models").User

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

}

module.exports = {
  getCoreHealth,
  getDatabaseHealth,
  getWorkerHealth,
  handleWorkerHealth
}
