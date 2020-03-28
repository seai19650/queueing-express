const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')

router.get('/', controller.getAllUsers)

router.post('/activate/:id', controller.activateUser)
router.post('/deactivate/:id', controller.deactivateUser)

module.exports = router