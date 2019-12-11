const express = require('express')
const router = express.Router()
const controller = require('../controllers/ResultController')
const cors = require('cors')
const passport = require('passport')

router.get('/:filename', controller.getResultFile)

module.exports = router