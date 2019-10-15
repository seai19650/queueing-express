const express = require('express')
const Request = require('../models').Request
const Text = require('../models').Text

const list = async (req, res) => {
  const payload = await Request.findAll({
    where: {id: req.params.id},
    include: {
      model: Text,
      as: 'texts'
    }
  })
  res.send(payload)
}

module.exports = {list}