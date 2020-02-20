const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()

const list = async (req, res) => {
  const payload = await Request.findAll({
    where: { id: req.params.id }
  })
  res.send(payload)
}

const getRequestByProjectId = async (req, res) => {
  const request = await Request.findOne({
    where: {projectId: req.params.projectId},
    include: [
      {
        model: Progress,
        as: "progresses"
      }
    ]
  })
  res.status(200).json(request)
}

const pushToQueue = async (req, res) => {
  // make new request payload
  let newRequest = {
    projectId: req.body.projectId,
    documents: req.body.documents.toString()
  }

  if (isDocumentFieldIsValid(req.body.documents)) {
    // store this new request into database
    Request.create(newRequest).then(request => {
      publish("","processing.requests",
          new Buffer.from(
              JSON.stringify({
                id: request.id,
                documents: request.documents
              })
          )
      )

      Progress.create({
        requestId: request.id,
        statusCode: "000",
        payload: request.id,
      })

      io.emit('request', {
        projectId: req.body.projectId,
        id:request.id
      })

      // send feedback
      res.status(201).json({
        projectId: req.body.projectId,
        id:request.id
      })
    }).catch(Sequelize.UniqueConstraintError , error => {
      res.status(409).json({
        projectId: req.body.projectId,
        status: `projectId(${req.body.projectId}) is not unique based on the API System.`
      })
    })
  } else {
    res.status(400).json({
      projectId: req.body.projectId,
      status: 'Documents must formed in the array format.'
    })
  }
}

function isDocumentFieldIsValid (documents) {
  try {
    console.log(JSON.parse(documents.replace(/'/g, '"')))
  } catch (e) {
    return false
  }
  return true
}

module.exports = { 
  list, 
  pushToQueue,
  getRequestByProjectId 
}