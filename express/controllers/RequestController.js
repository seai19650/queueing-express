const express = require('express')
const Request = require('../models').Request
const Image = require('../models').Image
const winston = require('winston')

const list = async (req, res) => {
  const payload = await Request.findAll({
    where: {id: req.params.id},
    include: {
      model: Image,
      as: 'images'
    }
  })
  res.send(payload)
}

module.exports = {list}