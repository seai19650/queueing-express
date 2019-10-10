const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')
const cors = require('cors')

router.get('/:id', controller.list)

module.exports = router