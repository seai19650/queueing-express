const express = require("express")
const Request = require("../models").Request
const Result = require("../models").Result
const fs = require("fs")

const getResultFileList = async (req, res) => {
  let request = await Request.findOne({
    where: {project_id: req.params.project_id},
    include: {
      model: Result,
      as: "results"
    }
  })
  request = request.get({plain: true})
  request.documents = JSON.parse(request.documents)
  res.status(200).json({
    project_id: req.params.project_id,
    results: request.results
  })
}

const getResultFile = async (req, res) => {
  if (req.params.fileIdentity.split(".").length > 1) {
    /**
     * Search By Filename
     * */
    if (fs.existsSync(`${__dirname}/../outputs/${req.params.fileIdentity}`)) {
      res.sendFile(req.params.fileIdentity, {root: __dirname + '/../outputs/'})
    } else {
      res.status(404).json({
        status: `This file(${req.params.fileIdentity}) does not exist on the server.`
      })
    }
  } else {
    /**
     * Search By project_id
     * */
    Request.findOne({
      where: {project_id: req.params.fileIdentity},
      include: {
        model: Result,
        as: "results"
      }
    }).then(request => {
      if (request !== null) {
        res.sendFile(request.result.filename, {root: __dirname + '/../outputs/'})
      } else {
        res.status(404).json({
          project_id: req.params.fileIdentity,
          status: `This file from project id (${req.params.fileIdentity}) does not exist on the server.`
        })
      }
    })
  }
}

const deleteResultFile = async (req, res) => {
  Request.findOne({where: {project_id: req.params.project_id}})
    .then(request => {
      Result.destroy({where: {request_id: request.id}})
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

module.exports = {
  getResultFileList,
  getResultFile,
  deleteResultFile
}
