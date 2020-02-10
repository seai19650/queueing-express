const express = require('express')
const router = express.Router()
const controller = require('../controllers/HistoryController')

const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.requireJwtAuthentication, controller.getHistory)

module.exports = router