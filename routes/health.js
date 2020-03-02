const express = require('express')
const router = express.Router()
const controller = require('../controllers/HealthController')

router.get('/database', controller.getDatabaseHealth)

module.exports = router