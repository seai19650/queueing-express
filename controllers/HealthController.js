const express = require("express")
const sequelize = require("../models").sequelize

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

const getRabbitMqHealth = async (req, res) => {

}

module.exports = {
  getDatabaseHealth
}
