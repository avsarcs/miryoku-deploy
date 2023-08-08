const Artwork = require('../models/Artwork')
const User = require('../models/User')
const excludeField = require('../util/excludeField')

// POST request to /artwork/rate/:id
const rateArtwork = async (req, res) => {

    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to rate artworks' })
    
    try {
        const rating = parseInt(req.body.rating)
        const artwork = await Artwork.findOne({_id: req.params.id}).exec()
        const artworkOwner = await User.findOne({_id: artwork.ownerID}).exec()
        const ratingUser = await User.findOne({_id: req.body.userID}).exec()

        artwork.rating.score = parseFloat(artwork.rating.score)
    artwork.rating.count = parseInt(artwork.rating.count)


    if (rating > 0 && rating <= 5 && !ratingUser.awRatings.hasOwnProperty(artwork._id)) {

        artworkOwner.points += Math.ceil((rating / 2))
        artworkOwner.markModified('points')
        await artworkOwner.save()

        artwork.rating.score = ((artwork.rating.score * artwork.rating.count) + rating) / (artwork.rating.count + 1)
        artwork.rating.count++;
        artwork.rating.score = artwork.rating.score.toFixed(2)
        artwork.markModified('rating')
        await artwork.save()

    } else {       
        artwork.rating.score =
            (
                ( 
                    (artwork.rating.score * artwork.rating.count)
                    - ratingUser.awRatings[artwork._id]
                    + parseInt(rating)
                )
                /
                artwork.rating.count
            )

        artwork.rating.score = artwork.rating.score.toFixed(2)
        artwork.markModified('rating')
        
        await artwork.save()
    }

    if (rating > 0 && rating <= 5) {
        ratingUser.awRatings[artwork._id] = parseInt(rating)
        ratingUser.markModified('awRatings')
        await ratingUser.save()
    }

    res.sendStatus(200)

    } catch (error) {
        res.status(500).json({"message": error.message})
    } 
}

// DELETE request to /artwork/:id
const deleteArtwork = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    if (!req?.params?.id) return res.status(400).json({"message": "Artwork id not provided"})

    const artworkID = req.params.id
    const artwork = await Artwork.findOne({_id: artworkID}).exec()

    if (artwork?.ownerID?.equals(user._id)) {
        user.featuredArtworks = user.featuredArtworks.filter((featuredID) => !featuredID.equals(artwork._id) )
        user.markModified('featuredArtworks')
        await user.save()
        await Artwork.deleteOne({_id: artworkID})
        res.sendStatus(200)
    } else {
        return res.status(400).json({"message": "You can only delete your own artworks!"})
    }
}

// GET request to /artwork
const getManyArtworks = async (req, res) => {
    const page = parseInt(req.query.page)
    const offset = (page - 1) * 50

    // Construct query according to the request parameters
    const types = req.query.types || []
    const tags = req.query.tags || []
    const title = req.query.title || ""
    const before = req.query.before || ""
    const after = req.query.after || ""
    
    const options = {}

    if (types.length > 0) {
        options.type = { $in: types }
    }
    
    if (tags.length > 0) {
        options.tags = { $in: tags }
    }

    if (before) {
        const targetDate = new Date(before)
        if (!isNaN(targetDate)) {
            options.createdAt = options.createdAt || {}
            options.createdAt.$lt = targetDate
        }
    }

    if (after) {
        const targetDate = new Date(after)
        if (!isNaN(targetDate)) {
            options.createdAt = options.createdAt || {}
            options.createdAt.$gt = targetDate
        }
    }

    if (title) {
        options.title = { $regex: title, $options: "i" }
    }

    try {

        const artworks = await Artwork.paginate(options, { offset, limit: 50, sort: { createdAt: -1 } })
        res.json(artworks)

    } catch (error) {

        res.status(400).json({"message": error.message})
    }

    
}

// GET request to /artwork/title/:id
const getArtworkTitle = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })
    const artworkName = await Artwork.findOne({_id: req.params.id}).select("title").exec()
    res.json(artworkName)
}

// GET request to /artwork/:id
const getArtwork = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })
    const artwork = await Artwork.findOne({_id: req.params.id}).exec()

    if (!artwork) {
        return res.status(204).json({ 'message': `Artwork ID ${req.params.id} not found` })
    }

    res.json(artwork)
}

// GET request to /artwork/user/:id
const getUserArtworks = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })

    const artworks = await Artwork.find({ ownerID: req.params.id }).sort({ createdAt: -1 }).exec()
    res.json(artworks)
}

// GET request to /artwork/featured/:id
const getFeaturedArtworks = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })

    const page = req.query.page || 1
    const offset = (page - 1) * 3

    try {
        const user = await User.findOne({_id: req.params.id}).exec()

        if (!user) {
          res.status(204).json({"message": "User with the given ID cannot be found"})
        }
    
        const fetchedFeaturedArtworks = await Artwork.paginate({
            _id: { $in: user.featuredArtworks },
            ownerID: req.params.id
        }, { offset, limit: 3, sort: { createdAt: -1 } })
    
        res.json(fetchedFeaturedArtworks)
      } catch (error) {
        res.status(500).json({"message": error.message})
      }

}

const updateArtwork = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })

    const artwork = await Artwork.findOne({_id: req.params.id}).exec()

    if (!artwork) return res.status(404).json({ "message": 'Artwork with given ID could not be found.' })

    const updatedArtwork = excludeField(req.body, 'userID')

    if (req.body.userID !== updatedArtwork.ownerID) return res.status(403).json({ "message": 'You can only update your own artworks' })

    await artwork.updateOne(updatedArtwork)
    await artwork.save()
}

// POST request to /artwork
const postArtwork = async (req, res) => {
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to post artworks' })

    const user = await User.findOne({_id: req.body.userID}).exec()
    
    const artwork = excludeField(req.body, 'userID')

    if ( await user.newArtwork(artwork) ) {

        try {
            const result = await Artwork.create(artwork)

            user.featuredArtworks.push(result._id)

            await user.save()
            res.status(201).json({ 'success': `New artwork ${artwork} created!` })
        } catch (err) {
            res.status(500).json({ 'message': err.message })
        }

    } else {
        return res.status(403).json({ "message": 'You must have 10 points to post an artwork' })
    }
    
}

module.exports = {
    deleteArtwork,
    getArtwork,
    updateArtwork,
    postArtwork,
    rateArtwork,
    getManyArtworks,
    getArtworkTitle,
    getUserArtworks,
    getFeaturedArtworks
}