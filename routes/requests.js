const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')

router.get('/:projectId', controller.getRequestByProjectId)
router.post('/', controller.pushToQueue)

module.exports = router