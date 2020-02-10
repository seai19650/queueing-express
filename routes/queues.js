const express = require('express')
const router = express.Router()
const controller = require('../controllers/QueueController')

const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.requireJwtAuthentication, controller.getQueue)

module.exports = router