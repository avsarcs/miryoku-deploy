const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')

router.route('/')
    .delete( usersController.deleteUser )

router.route('/me')
    .get( usersController.getMe )

router.route('/minimal/:id')
    .get( usersController.getUserMinimal )

router.route('/:id')
    .get( usersController.getUser )

router.route('/:id')
    .patch( usersController.updateUser )

module.exports = router