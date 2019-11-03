const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')
const cors = require('cors')
const passport = require('passport')

router.get('/:id', passport.authenticate('jwt', {session: false}),controller.list)
router.post('/', controller.pushToQueue)
router.post('/process', controller.handleProcessStatus)

module.exports = router