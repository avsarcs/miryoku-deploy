const express = require('express')
const router = express.Router()
const flagsController = require('../../controllers/flagsController')

router.route('/')
    .post( flagsController.postFlag )    

router.route('/:id')
    .delete( flagsController.deleteFlag )
    .get( flagsController.getFlag )

module.exports = router