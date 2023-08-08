const express = require('express')
const router = express.Router()
const opinionsController = require('../../controllers/opinionsController')

router.route('/')
    .post( opinionsController.postOpinion )

module.exports = router