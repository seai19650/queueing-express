const express = require("express")
const Request = require("../models").Request
const Result = require("../models").Result
const fs = require("fs")

const getResultFile = async (req, res) => {
  if (req.params.fileIdentity.split(".").length > 1) {
    /** 
     * Search By Filename 
     * */
    isFileExisted(req.params.fileIdentity)
  } else {
    /** 
     * Search By projectId 
     * */
    Request.findOne({
      where: {projectId: req.params.fileIdentity},
      include: {
        model: Result,
        as: "result"
      }
    }).then(request => {
      if (request !== null) {
        res.sendFile(request.result.filename, { root: __dirname + '../../outputs/' })
      } else {
        res.status(404).json({
          projectId: req.params.fileIdentity,
          status: `This file(${request.result.filename}) does not exist on the server.`
        })
      }
    })
  }
}

const deleteResultFile = async (req, res) => {
  Request.findOne({where: {projectId: req.params.projectId}})
  .then(request => {
    Result.destroy({where: {requestId: request.id}})
    .then(deleteResult => {
      fs.unlink(`${__dirname}../../outputs/${req.params.fileIdentity}`, err => {
        if (err) {
          console.log(err)
        } else {
          res.status(200).json(deleteResult)
        }
      })
    })
  })
}

function isFileExisted (filename) {
  if (fs.existsSync(`${__dirname}../../outputs/${filename}`)) {
    res.sendFile(filename, { root: __dirname + '../../outputs/' })
  } else {
    res.status(404).json({
      status: `This file(${request.params.fileIdentity}) does not exist on the server.`
    })
  }
}

module.exports = {
  getResultFile,
  deleteResultFile
}
