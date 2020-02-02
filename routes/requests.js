const express = require('express')
const router = express.Router()
const controller = require('../controllers/RequestController')
const cors = require('cors')
const passport = require('passport')
var multer  = require('multer')
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'outputs/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + [...Array(30)].map(() => Math.random().toString(36)[2]).join('') + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({storage: storage})

router.get('/:projectId', controller.getRequestByProjectId)
router.post('/', controller.pushToQueue)

router.get('/progress', controller.getLatestProgresses)
router.post('/progress', upload.array('file'), controller.handleProgressStatus)

module.exports = router