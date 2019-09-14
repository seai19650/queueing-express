const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const cars = require('./routes/cars')

app.use('/car', cars)

app.listen(3000, () => {
    console.log('My Rest API running on port 3000!');
})