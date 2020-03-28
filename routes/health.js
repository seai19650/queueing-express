const express = require('express')
const router = express.Router()
const controller = require('../controllers/HealthController')

router.get('/core', controller.getCoreHealth)

router.get('/database', controller.getDatabaseHealth)
router.get('/rabbitmq', controller.getRabbitMqHealth)

router.get('/worker', controller.getWorkerHealth)
router.post('/worker', controller.handleWorkerHealth)

module.exports = router