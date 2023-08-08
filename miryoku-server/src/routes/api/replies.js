const express = require('express')
const router = express.Router()
const repliesController = require('../../controllers/repliesController')

router.route('/')
    .post( repliesController.postReply )    

router.route('/feedback/:id')
    .get( repliesController.getFeedbackReplies )

router.route('/comment/:id')
    .get( repliesController.getCommentReplies )

router.route('/:id')
    .post( repliesController.toggleReplyLike )
    .delete( repliesController.deleteReply )
    .get( repliesController.getReply )
    .patch( repliesController.updateReply )

module.exports = router