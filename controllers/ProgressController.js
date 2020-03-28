const express = require("express")
const Sequelize = require('sequelize')
const Request = require("../models").Request
const Progress = require("../models").Progress
const Result = require("../models").Result
const publish = require("../rabbitmq").publish
const io = require("../io").getio()
const api = require("../api")
const request = require("request")

let latestProgresses = {}

const handleProgressStatus = async (req, res) => {

  console.log(` ==> [${req.body.id}] : ${req.body.code} "${api.getStatusMessage(req.body.code, req.body.payload)}"`)

  if (req.body.data) {
    req.body.data = JSON.parse(req.body.data.replace(/'/g, '"'))
  }

  if (typeof req.body.payload === "string") {
    req.body.payload = [req.body.payload]
  }

  let progress = {
    request_id: req.body.id,
    status_code: req.body.code,
    payload: req.body.payload.toString(),
  }

  if (req.body.keep) {
    Progress.create(progress)
  }

  console.log(progress.status_code)
  console.log(progress.status_code.startsWith("6"))
  if (progress.status_code.startsWith("6")) {
    Request.update({
      is_error: true
    }, {
      where: {
        id: req.body.id
      }
    })
  }

  // The Progress is result data
  if (progress.status_code === '192') {

    Request.update({
      is_completed: true
    }, {
      where: {
        id: req.body.id
      }
    })

    let result = {
      request_id: req.body.id,
      topic_chart_url: JSON.stringify(req.body.data.topic_chart_url),
      term_topic_matrix: JSON.stringify(req.body.data.term_topic_matrix),
      document_topic_matrix: JSON.stringify(req.body.data.document_topic_matrix),
      topic_stat: JSON.stringify(req.body.data.topic_stat),
      term_pairs: JSON.stringify(req.body.data.term_pairs),
      unreadable_documents: JSON.stringify(req.body.data.unreadable_documents),
      undownloadable_documents: JSON.stringify(req.body.data.undownloadable_documents)
    }

    // Save it to database
    Result.create(result)

    // send result to endpoint
    request.post({
        headers: {
          'Authorization': "Token 8e1e28f778add052a00bc687bf9965b97527b191",
          'content-type': 'application/json'
        },
        url: process.env.ENDPOINT,
        body: result,
        json: true
      },
      (error, response, body) => {

        if (error) {
          console.log(error)
          Request.update({
            is_notified: false
          }, {
            where: {
              id: req.body.id
            }
          })
          io.emit('system', {
            'isError': true,
            'message': 'Failed to Notify Endpoint.'
          })
        } else {
          Request.update({
            is_notified: true
          }, {
            where: {
              id: req.body.id
            }
          })

          io.emit('system', {
            'isError': false,
            'message': `Notified endpoint on id:${req.body.id} result`
          })
        }
      }
    )

  }

  progress.status = api.getStatusMessage(req.body.code, req.body.payload)
  io.emit('progress', {'payload': progress})
  if (progress.status_code === '050') {
    io.emit('history', {'payload': progress})
  }

  // temporary store this progress in the latest progresses list
  latestProgresses[req.body.id] = progress
  if (Object.keys(latestProgresses).length > 50) {
    delete latestProgresses[Object.keys(latestProgresses).map(Number).sort()[0]]
  }

  res.status(204).send()

}

const getLatestProgresses = async (req, res) => {
  res.status(200).json({
    data: Object.keys(latestProgresses)
      .map(Number)
      .sort()
      .reverse()
      .map(progressId => latestProgresses[progressId])
  })
}

module.exports = {
  handleProgressStatus,
  getLatestProgresses
}
