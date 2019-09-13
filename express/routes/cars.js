const express = require('express')
const router = express.Router()
const controller = require('../controllers/CarController')
const upload = require('multer')

router.get('/', controller.createCar)
router.get('/', controller.uploadCar)

module.exports = router