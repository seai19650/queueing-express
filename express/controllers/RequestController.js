const express = require("express")
const Sequelize = require('sequelize');
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()

let latestProgresses = []

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
    documents: req.body.documents
  }
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
}

const handleProgressStatus = async (req, res) => {

  console.log("== Progress Update from "+  req.body.id +" said : " + req.body.status + " ==")
  
  // make new progress payload
  newProgress = {
    requestId: req.body.id,
    status: req.body.status
  }

  // make payload for ws
  emitPayload = Object.assign({},req.body)

  // check if it's file or not
  if (req.files) {
    Result.create({
      requestId: req.body.id,
      filename: req.files[0].filename
    })
    emitPayload.filename = req.files[0].filename
  }
  
  // check if this progress needs to be stored in the database
  if (req.body.keep === 'True') {
    Progress.create(newProgress)
  }

  // send data to ws
  io.emit('progress', {payload: emitPayload})

  // temporary store this progress in the latest progresses list
  latestProgresses.push(emitPayload)
  if (latestProgresses.length > 50) {
    latestProgresses.shift()
  }
  
  res.status(204).send()

}

const getLatestProgresses = async (req, res) => {
  res.status(200).send(latestProgresses)
}

module.exports = { 
  list, 
  pushToQueue, 
  handleProgressStatus, 
  getLatestProgresses, 
  getRequestByProjectId 
}
