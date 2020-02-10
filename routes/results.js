const express = require('express')
const router = express.Router()
const controller = require('../controllers/ResultController')

const authMiddleware = require('../middlewares/auth')

router.get('/:fileIdentity', controller.getResultFile)
router.delete('/:projectId', controller.deleteResultFile)

module.exports = router