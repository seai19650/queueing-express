const express = require('express')
const router = express.Router()
const controller = require('../controllers/HistoryController')

router.get('/', controller.getHistory)

module.exports = router