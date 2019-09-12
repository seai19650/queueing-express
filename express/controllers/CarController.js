const express = require('express')
const Car = require('../models').Car

const getCar = async (req, res) => {
  const car = await Car.findByPk(3)
  res.send(`ok controller ${car.dataValues}`)
}

module.exports = {getCar}