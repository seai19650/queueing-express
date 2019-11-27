const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")
const db = require("./models")
const http = require('http').createServer(express);
const io = require("socket.io")(http)

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors())

// Authentication Logic
require("./passport.js")

// Routing Logic
const requests = require("./routes/requests")
const auth = require("./routes/auth")

app.use("/request", requests)
app.use("/auth", auth)

io.on('connection', function(socket){
    console.log('a user connected')
    socket.on('disconnect', function(){
        console.log('user disconnected');
    })
})

app.listen(3000, () => {
    db.sequelize.sync()
    console.log("My Rest API running on port 3000!")
})