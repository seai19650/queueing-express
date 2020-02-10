const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const db = require("./models")

const app = express()
const http = require('http').createServer(app)
const io = require('./io').init(http)

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors({
    origin: 'http://queueing-frontend:3000',
    credentials: true,
}))

// Routing Logic
const auth = require("./routes/auth")
const requests = require("./routes/requests")
const progresses = require("./routes/progresses")
const result = require("./routes/results")
const history = require("./routes/histories")
const queue = require("./routes/queues")

app.get("/", function(req, res) {
    return res.send("Proxy API Server Container")
})

app.use("/auth", auth)
app.use("/request", requests)
app.use("/progress", progresses)
app.use("/result", result)
app.use("/history", history)
app.use("/queue", queue)

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