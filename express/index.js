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
    origin: 'http://localhost:3000',
    credentials: true,
}))

// Authentication Logic
require("./passport.js")

// Routing Logic
const requests = require("./routes/requests")
const auth = require("./routes/auth")
const result = require("./routes/results")

app.use("/request", requests)
app.use("/auth", auth)
app.use("/result", result)

http.listen(3000, '0.0.0.0', () => {
    db.sequelize.sync()
    console.log("My Rest API running on port 3000!")
})

// Socket.io
io.on('connection', (socket) => {
    socket.emit('system', {message: 'Hi, Server is talking'})
})