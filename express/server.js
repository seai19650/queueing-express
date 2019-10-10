const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const requests = require('./routes/requests')

app.use('/request', requests)

// db.Request.findOne({
//     subQuery: false,
//     where: {id: 1},
//     include: [{
//         model: db.Image,
//         as: 'images'
//     }]
// })
// .then(findedRequest => { console.log(findedRequest) })
// .catch(error => { console.log(error) })


app.listen(3000, () => {
    db.sequelize.sync()
    console.log('My Rest API running on port 3000!')
})