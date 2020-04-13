const amqp = require("amqplib/callback_api")

let amqpConn = null

function start() {
  amqp.connect(`amqp://ml-rabbitmq:passwordpala@${process.env.RABBITMQ_HOST || 'queueing-rabbitmq'}`, function(
    err,
    conn
  ) {
    if (err) {
      console.error("[-System-] Queue Engine -> ", err.message)
      return setTimeout(start, 1000)
    }
    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[-System-] Queue Engine's connection is malfunction", err.message)
      }
    })
    conn.on("close", function() {
      console.error("[-System-] Queue Engine is reconnecting")
      return setTimeout(start, 1000)
    })
    console.log("[-System-] Queue Engine is connected")
    amqpConn = conn
    whenConnected()
  })
}

function whenConnected() {
  startPublisher()
  startWorker()
}

let pubChannel = null
let offlinePubQueue = []
function startPublisher() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return
    ch.on("error", function(err) {
      console.error("[-System-] Queue Engine is on channel error", err.message)
    })
    ch.on("close", function() {
      console.log("[-System-] Queue Engine is on channel closed")
    })

    pubChannel = ch
    pubChannel.assertQueue("processing.requests", {durable: true})
    while (true) {
      let m = offlinePubQueue.shift()
      if (!m) break
      publish(m[0], m[1], m[2])
    }
  })
}

function publish(exchange, routingKey, content) {

  try {
    pubChannel.publish(
      exchange,
      routingKey,
      content,
      { persistent: true },
      function(err, ok) {
        if (err) {
          console.error("[-System-] Queue Engine is having a problem with publishing", err)
          offlinePubQueue.push([exchange, routingKey, content])
          pubChannel.connection.close()
        }
      }
    )
  } catch (e) {
    console.error("[-System-] Queue Engine is having a problem with publishing", e.message)
    offlinePubQueue.push([exchange, routingKey, content])
  }
}

function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return
    ch.on("error", function(err) {
      console.error("[-System-] Queue Engine is on channel error", err.message)
    })
    ch.on("close", function() {
      console.log("[-System-] Queue Engine is on channel closed")
    })

    ch.prefetch(10)
    ch.assertQueue("processing.results", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return
      ch.consume("processing.results", processMsg, { noAck: false })
      console.log("[-System-] Worker is detected and registered")
    })
  })
}

function processMsg(msg) {
  work(msg, function(ok) {
    try {
      if (ok)
        ch.ack(msg)
      else
        ch.reject(msg, true)
    } catch (e) {
      closeOnErr(e)
    }
  })
}

function work(msg, cb) {
  console.log("[-System-] Queue Engine is requesting processing of ", msg.content.toString())
  cb(true)
}

function closeOnErr(err) {
  if (!err) return false
  console.error("[-System-] Queue Engine is on error", err)
  amqpConn.close()
  return true
}

start()

module.exports = { publish }
