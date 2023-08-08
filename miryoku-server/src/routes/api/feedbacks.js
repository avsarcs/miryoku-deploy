const express = require('express')
const router = express.Router()
const feedbacksController = require('../../controllers/feedbacksController')

router.route('/')
    .post( feedbacksController.postFeedback )

router.route('/artwork/:id')
    .get( feedbacksController.getArtworkFeedbacks )

router.route('/:id')
    .post( feedbacksController.rateFeedback )
    .delete( feedbacksController.deleteFeedback )
    .get( feedbacksController.getFeedback )
    .patch( feedbacksController.updateFeedback )

router.route('/user/:id')
    .get( feedbacksController.getUserFeedbacks )

module.exports = router