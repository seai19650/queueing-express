const express = require('express')
const router = express.Router()
const controller = require('../controllers/CarController')
const cors = require('cors')

router.get('/', controller.createCar)
router.post('/', controller.uploadCar)

module.exports = router