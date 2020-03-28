const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const db = require("./models")

const app = express()
const http = require('http').createServer(app)
const io = require('./io').init(http)

const redis = require('redis')
const redisClient = require('./redis').init(redis)

app.use(bodyParser.json({limit: '200mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '200mb', extended: true, parameterLimit: 50}))
app.use(cors({
    origin: '*',
    credentials: true,
}))

const env = process.env.NODE_ENV || "development"

if (env.startsWith("k8s")) {
    prefixApi = "/api"
    console.log("K8s Mode")
} else {
    prefixApi = ""
    console.log("Development Mode")
}

// Routing Logic
const auth = require("./routes/auth")
const requests = require("./routes/requests")
const progresses = require("./routes/progresses")
const result = require("./routes/results")
const history = require("./routes/histories")
const queue = require("./routes/queues")
const health = require("./routes/health")
const core = require("./routes/core")
const user = require("./routes/user")

app.get(`${prefixApi}/`, function(req, res) {
    return res.send("Proxy API Server Container")
})

app.post(`${prefixApi}/`, function(req, res) {
    return res.json(req.body)
})

app.use(`${prefixApi}/auth`, auth)
app.use(`${prefixApi}/request`, requests)
app.use(`${prefixApi}/progress`, progresses)
app.use(`${prefixApi}/result`, result)
app.use(`${prefixApi}/history`, history)
app.use(`${prefixApi}/queue`, queue)
app.use(`${prefixApi}/health`, health)
app.use(`${prefixApi}/core`, core)
app.use(`${prefixApi}/user`, user)

http.listen(3000, '0.0.0.0', () => {
    db.sequelize.sync()
    console.log("My Rest API running on port 3000!")
})

// Socket.io
io.on('connection', (socket) => {
    console.log("[Socket.io] Launch")
    socket.emit('system', {message: 'Hi, Server is talking'})
    socket.on('message', function(data) {
        console.log(data)
    })
})