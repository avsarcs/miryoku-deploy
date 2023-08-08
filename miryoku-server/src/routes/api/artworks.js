const express = require('express')
const router = express.Router()
const artworksController = require('../../controllers/artworksController')

router.route('/')
    .post( artworksController.postArtwork )
    .get( artworksController.getManyArtworks )
    
router.route('/rate/:id')
    .post( artworksController.rateArtwork )

router.route('/featured/:id')
    .get( artworksController.getFeaturedArtworks )

router.route('/title/:id')
    .get( artworksController.getArtworkTitle )

router.route('/user/:id')
    .get( artworksController.getUserArtworks )

router.route('/:id')
    .delete( artworksController.deleteArtwork )
    .get( artworksController.getArtwork )
    .patch( artworksController.updateArtwork )

module.exports = router