const express = require("express")

const getResultFile = async (req, res) => {
  res.sendFile(req.params.filename, { root: __dirname + '../../outputs/' })
}

module.exports = { getResultFile }
