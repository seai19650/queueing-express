const express = require('express')
const router = express.Router()
const controller = require('../controllers/CarController')

router.get('/', controller.getCar)

module.exports = router