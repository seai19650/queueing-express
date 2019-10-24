const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const cors = require("cors")
const db = require("./models")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Authentication Logic
require("./passport.js")

// Routing Logic
const requests = require("./routes/requests")
const auth = require("./routes/auth")

app.use("/request", requests)
app.use("/auth", auth)

app.listen(3000, () => {
    db.sequelize.sync()
    console.log("My Rest API running on port 3000!")
})