const express = require('express')
const router = express.Router()
const controller = require('../controllers/AuthController')

const authMiddleware = require('../middlewares/auth')

router.post('/login', authMiddleware.requireLoginAuthentication, controller.doLogin)
router.get('/user', authMiddleware.requireJwtAuthentication, controller.getUserData)
router.post('/register', controller.doRegister)

module.exports = router