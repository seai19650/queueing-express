const express = require('express')
const router = express.Router()
const controller = require('../controllers/ResultController')

const authMiddleware = require('../middlewares/auth')

router.get('/:project_id', controller.getResultFileList)
router.get('/file/:fileIdentity', controller.getResultFile)
router.delete('/:project_id', controller.deleteResultFile)

module.exports = router