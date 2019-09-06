const express = require('express')

const getCar = (req, res) => {
  res.send('ok controller');
}

module.exports = {getCar}