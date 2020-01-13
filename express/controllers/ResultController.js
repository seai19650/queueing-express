const express = require("express")
const Request = require("../models").Request
const Result = require("../models").Result

const getResultFile = async (req, res) => {
  if (req.params.fileIdentity.split(".").length > 1) {
    res.sendFile(req.params.fileIdentity, { root: __dirname + '../../outputs/' })
  } else {
    Request.findOne({
      where: {projectId: req.params.fileIdentity},
      include: {
        model: Result,
        as: "result"
      }
    }).then(request => {
      res.sendFile(request.result.filename, { root: __dirname + '../../outputs/' })
    })
  }
}

const deleteResultFileById = async (req, res) => {

}

module.exports = {
  getResultFile,
  deleteResultFileById
}
