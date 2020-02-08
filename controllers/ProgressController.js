const express = require("express")
const Sequelize = require('sequelize')
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()

let latestProgresses = {}

const handleProgressStatus = async (req, res) => {
  console.log("== Progress Update from "+  req.body.id +" said : " + req.body.status + " ==")
  // make new progress payload
  let newProgress = {
    requestId: req.body.id,
    status: req.body.status
  }

  // make payload for ws
  let emitPayload = Object.assign({},req.body)

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
  latestProgresses[req.body.id] = emitPayload
  if (Object.keys(latestProgresses).length > 50) {
    console.log("Progress Temp Shift")
    delete latestProgresses[Object.keys(latestProgresses).map(Number).sort()[0]]
  }
  
  res.status(204).send()

}

const getLatestProgresses = async (req, res) => {
  res.status(200).json(latestProgresses)
}

module.exports = { 
  handleProgressStatus, 
  getLatestProgresses
}
