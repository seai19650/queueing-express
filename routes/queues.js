const express = require('express')
const router = express.Router()
const controller = require('../controllers/QueueController')

router.get('/', controller.getQueue)

module.exports = router