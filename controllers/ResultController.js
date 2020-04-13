const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const SimilarityResult = require("../models").SimilarityResult
const fs = require("fs")
const api = require("../api")

const getResultByProjectId = async (req, res) => {

  let targetedResultFields = []
  targetedResultFields.push("topic_chart_url")
  if (req.query.getField !== undefined) {
    targetedResultFields = targetedResultFields.concat(req.query.getField.split(","))
  }
  targetedResultFields.push("undownloadable_documents")
  targetedResultFields.push("unreadable_documents")
  targetedResultFields.push("created_at")

  let request = await Request.findOne({
    where: {project_id: req.params.project_id},
    include: [
      {
        model: Progress,
        as: "progresses"
      },
      {
        model: Result,
        as: "result",
        attributes: targetedResultFields,
      },
      {
        model: SimilarityResult,
        as: "similarityResult",
        attributes: {exclude: ['updated_at', 'request_id']}
      }
    ]
  }).catch(Sequelize.DatabaseError, error => {
    res.status(400).json({
      message: `${error.message.split("\n")[0]}`
    })
  })

  targetedResultFields.splice(targetedResultFields.indexOf("created_at"), 1)

  if (request !== null) {
    let result = request.get("result")
    let similarityResult = request.get("similarityResult")
    if (result !== null) {
      targetedResultFields.forEach(field => {
        result[field] = JSON.parse(result[field])
        if (field === 'topic_chart_url') {
          result[field] = `${process.env.SERVER_ADDRESS ? process.env.SERVER_ADDRESS : 'http://localhost:8080'}/api/result/file/${result[field].th}`
        }
      })
      res.status(200).json(
        {
          project_id: req.params.project_id,
          error: false,
          success: request.get('is_completed'),
          ...result.get({plain: true})
        }
      )
    } else if (similarityResult !== null) {
      targetedResultFields.splice(targetedResultFields.indexOf("topic_chart_url"), 1)
      targetedResultFields.unshift("topic_similarity")
      targetedResultFields.forEach(field => {
        similarityResult[field] = JSON.parse(similarityResult[field])
      })
      res.status(200).json(
        {
          project_id: req.params.project_id,
          error: false,
          success: request.get('is_completed'),
          similarity_type: request.get("criteria"),
          ...similarityResult.get({plain: true})
        }
      )
    } else {
      const errorLog = request.get("progresses").reverse()[0]
      if (request.get('is_error')) {
        res.status(202).json({
          project_id: req.params.project_id,
          error: true,
          success: request.get('is_completed'),
          error_message: api.getStatusMessage(errorLog.status_code, errorLog.payload),
          message: `Project ID ${req.params.project_id} was stopped due to an error.`
        })
      } else {
        res.status(202).json({
          project_id: req.params.project_id,
          error: false,
          success: request.get('is_completed'),
          message: `Project ID ${req.params.project_id} is still being processed.`
        })
      }
    }
  } else {
    res.status(404).json({
      message: `Project ID ${req.params.project_id} does not present on the database.`
    })
  }
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
