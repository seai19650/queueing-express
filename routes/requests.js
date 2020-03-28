const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')

const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.requireJwtAuthentication, controller.getRequests)
router.get('/:project_id', controller.getRequestByProjectId)
router.get('/name/:project_name', authMiddleware.requireJwtAuthentication, controller.getRequestByProjectName)
router.post('/', controller.pushToQueue)
router.delete('/:id', authMiddleware.requireJwtAuthentication, controller.deleteRequestById)

module.exports = router