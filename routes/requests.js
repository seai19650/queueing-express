const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')

const authMiddleware = require('../middlewares/auth')

router.get('/:project_id', authMiddleware.requireJwtAuthentication, controller.getRequestByProjectId)
router.post('/', controller.pushToQueue)

module.exports = router