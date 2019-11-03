const express = require("express");
const Request = require("../models").Request;
const Text = require("../models").Text;
const publish = require("../rabbitmq").publish;

const list = async (req, res) => {
  const payload = await Request.findAll({
    where: { id: req.params.id },
    include: {
      model: Text,
      as: "texts"
    }
  });
  res.send(payload);
};

const pushToQueue = async (req, res) => {
  console.log(req.body)
  publish(
    "",
    "processing.requests",
    new Buffer.from(
      JSON.stringify({
        projectId: req.body.projectId,
        documents: req.body.documents
      })
    )
  );
  res.send("ok");
}

const handleProcessStatus = async (req, res) => {
  console.log(req.body)
  res.send("ok")
}

module.exports = { list, pushToQueue, handleProcessStatus };
