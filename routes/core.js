const express = require('express')
const router = express.Router()
const controller = require('../controllers/CoreController')

router.post('/register', controller.doRootRegister)

module.exports = router