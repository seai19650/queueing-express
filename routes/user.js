const express = require('express')
const router = express.Router()
const controller = require('../controllers/UserController')
const authMiddleware = require('../middlewares/auth')

router.get('/', authMiddleware.requireJwtAuthentication, controller.getAllUsers)
router.delete('/:id', authMiddleware.requireJwtAuthentication, controller.deleteUserById)

router.post('/activate/:id', authMiddleware.requireJwtAuthentication, controller.activateUser)
router.post('/deactivate/:id', authMiddleware.requireJwtAuthentication, controller.deactivateUser)

module.exports = router