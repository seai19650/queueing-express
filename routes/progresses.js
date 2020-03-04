const express = require('express')
const router = express.Router()
const multer  = require('multer')
const path = require('path')
const controller = require('../controllers/ProgressController')

const authMiddleware = require('../middlewares/auth')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'outputs/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + [...Array(30)].map(() => Math.random().toString(36)[2]).join('') + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({storage: storage})

router.get('/', authMiddleware.requireJwtAuthentication, controller.getLatestProgresses)
router.post('/', upload.array('resultFile',2), controller.handleProgressStatus)


module.exports = router