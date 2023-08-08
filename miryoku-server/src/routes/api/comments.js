const express = require('express')
const router = express.Router()
const commentsController = require('../../controllers/commentsController')

router.route('/')
    .post( commentsController.postComment )    

router.route('/artwork/:id')
    .get( commentsController.getArtworkComments )

router.route('/:id')
    .post( commentsController.toggleCommentLike )
    .delete( commentsController.deleteComment )
    .get( commentsController.getComment )
    .patch( commentsController.updateComment )

module.exports = router