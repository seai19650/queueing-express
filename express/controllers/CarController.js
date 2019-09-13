const express = require('express')
const Car = require('../models').Car

const createCar = async (req, res) => {
  const car = await Car.findByPk(3)
  res.send(`ok controller ${car.dataValues}`)
}

const uploadCar = async (req, res) => {
  res.send(`ok uploads`)
}

module.exports = {createCar, uploadCar}