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
  publish(
    "",
    "processing.requests",
    new Buffer.from(
      JSON.stringify({
        id: req.body.projectId
      })
    )
  );
  res.send("ok");
}

module.exports = { list, pushToQueue };
