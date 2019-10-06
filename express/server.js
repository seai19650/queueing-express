const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const cars = require('./routes/cars')

app.use('/car', cars)

db.Request.findOne({
    where: {id: 1}, include: ['images']
}).then(findedRequest => {
    console.log(findedRequest)
})


app.listen(3000, () => {
    db.sequelize.sync()
    console.log('My Rest API running on port 3000!')
})