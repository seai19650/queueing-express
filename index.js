const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const db = require("./models")
const app = express()
const http = require('http').createServer(app)

const env = process.env.NODE_ENV || "development"

const io = require('./io').init(http)
const redis = require('redis')
const redisClient = require('./redis').init(redis)
const dbConfig = require(__dirname + '/config/config.json')[env];

app.use(bodyParser.json({limit: '200mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '200mb', extended: true, parameterLimit: 50}))
app.use(cors({
    origin: '*',
    credentials: true,
}))

let prefixApi
if (env.startsWith("k8s")) {
    prefixApi = "/api"
    console.log("[-System-] Set Mode as Kubernetes Production")
} else {
    prefixApi = ""
    console.log("[-System-] Set Mode as Development")
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
    return res.status(200).json({
        serverAddress: process.env.SERVER_ADDRESS || "http://localhost:8080",
        serverEnvironment: {
            mainEnv: env,
            redisHost: process.env.REDIS_HOST || 'queueing-redis',
            db: {
                host: dbConfig.host,
                dialect: dbConfig.dialect
            },
            rabbitmqHost: process.env.RABBITMQ_HOST || 'queueing-rabbitmq'
        },
        systemName: "Core API",
        state: "Online"
    })
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
    console.log("[-System-] Boot up successfully")
})

// Socket.io
io.on('connection', (socket) => {
    console.log("[-System-] Socket.io is initialized")
})