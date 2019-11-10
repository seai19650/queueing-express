const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")
const db = require("./models")
const expressWs = require("express-ws")(app)

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors())

// Authentication Logic
require("./passport.js")

// Routing Logic
const requests = require("./routes/requests")
const auth = require("./routes/auth")
const websocket = require("./routes/websocket")

app.use("/request", requests)
app.use("/auth", auth)

// WebSocket
app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    })
    console.log('socket', req.testing)
})

app.listen(3000, () => {
    db.sequelize.sync()
    console.log("My Rest API running on port 3000!")
})