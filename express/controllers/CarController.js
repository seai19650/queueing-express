const express = require('express')
const Car = require('../models').Car
const winston = require('winston')

const createCar = async (req, res) => {
  const car = await Car.findByPk(3)
  res.send(`ok controller ${car.dataValues}`)
}

const uploadCar = async (req, res) => {
  winston.info(`soooo`)
  res.send(`ok uploads`)
}

module.exports = {createCar, uploadCar}