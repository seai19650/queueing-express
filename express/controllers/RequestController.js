const express = require("express")
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()

const list = async (req, res) => {
  const payload = await Request.findAll({
    where: { id: req.params.id },
    include: {
      model: Text,
      as: "texts"
    }
  })
  res.send(payload)
}

const pushToQueue = async (req, res) => {
  newRequest = {
    clientId: req.body.cliendId,
    documents: req.body.documents
  }
  Request.create(newRequest).then(request => {
    publish(
      "",
      "processing.requests",
      new Buffer.from(
        JSON.stringify({
          id: request.id,
          documents: request.documents
        })
      )
    )
  })
  res.send("ok")
}

const handleProgressStatus = async (req, res) => {
  console.log("== Progress Update from "+  req.body.id +" said : " + req.body.status)
  newProgress = {
    status: req.body.status,
    requestId: req.body.id
  }
  emitPayload = Object.assign({},req.body)
  if (req.files) {
    Result.create({
      requestId: req.body.id,
      filename: req.files[0].filename
    })
    emitPayload.filename = req.files[0].filename
  }
  if (req.body.keep === 'True') {
    Progress.create(newProgress)
  }
  io.emit('progress', {payload: emitPayload})
  res.status(200).send()
}

module.exports = { list, pushToQueue, handleProgressStatus }
