const bodyParser = require('body-parser')
const express = require('express')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const cars = require('./routes/cars')

app.use('/', cars)

app.listen(3000, () => {
    console.log('My Rest API running on port 3000!');
})