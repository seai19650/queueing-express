const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Result = require("../models").Result
const fs = require("fs")

const getResultByProjectId = async (req, res) => {

  let targetedResultFields = []
  targetedResultFields.push("topic_chart_url")
  if (req.query.getField !== undefined) {
    targetedResultFields = targetedResultFields.concat(req.query.getField.split(","))
  }
  targetedResultFields.push("undownloadable_documents")
  targetedResultFields.push("unreadable_documents")

  let request = await Request.findOne({
    where: {project_id: req.params.project_id},
    include: {
      model: Result,
      as: "result",
      attributes: targetedResultFields,
    }
  }).catch(Sequelize.DatabaseError, error => {
    res.status(400).json({
      message: `${error.message.split("\n")[0]}`
    })
  })

  let result = request.get("result")
  targetedResultFields.forEach(field => {
    result[field] = JSON.parse(result[field])
  })

  res.status(200).json({
    project_id: req.params.project_id,
    result: result
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
  getResultByProjectId,
  getResultFile,
  deleteResultFile
}
