const User = require('../models/User')
const Feedback = require('../models/Feedback')
const excludeField = require('../util/excludeField')

// POST request to /feedback/:id
const rateFeedback = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to rate feedbacks' })

    try {
        const feedback = await Feedback.findOne({ _id: req.params.id }).exec()
        const feedbackOwner = await User.findOne({ _id: feedback.ownerID }).exec()
        const ratingUser = await User.findOne({ _id: req.body.userID }).exec()
        const rating = req.body.rating

        if (!rating || !feedback || !feedbackOwner || !ratingUser) {
            return res.status(400).json({ "message": 'Information provided with request insufficient.' })
        }

        if (rating > 0 && rating <= 10 && !ratingUser.feedbackRatings.hasOwnProperty(feedback._id)) {

            if (!feedbackOwner._id.equals( ratingUser._id )) {
                feedbackOwner.points = parseInt(feedbackOwner.points) + parseInt(rating)
                feedbackOwner.markModified('points')
                await feedbackOwner.save()
            }

            feedback.usefulness.rating = ((parseFloat(feedback.usefulness.rating) * parseInt(feedback.usefulness.count)) + parseInt(rating)) / (parseInt(feedback.usefulness.count) + 1)
            feedback.usefulness.count++
            feedback.usefulness.rating = feedback.usefulness.rating.toFixed(2)
            feedback.markModified('rating')
            await feedback.save()

        } else {
            feedback.usefulness.rating =
            (
                ( 
                    (parseFloat(feedback.usefulness.rating) * parseInt(feedback.usefulness.count))
                    - parseInt(ratingUser.feedbackRatings[feedback._id])
                    + parseInt(rating)
                )
                /
                parseInt(feedback.usefulness.count)
            )
            feedback.usefulness.rating = feedback.usefulness.rating.toFixed(2)
            feedback.markModified('rating')
            await feedback.save()
        }

        ratingUser.feedbackRatings[feedback._id] = rating
        ratingUser.markModified('feedbackRatings')
        await ratingUser.save()
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({"message": error.message})
    }
    
}

// For deletion send DELETE request to /feedback/:id
const deleteFeedback = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    if (!req?.params?.id) return res.status(400).json({"message": "Feedback ID not provided"})

    const feedbackID = req.params.id
    const feedback = await Feedback.findOne({ _id: feedbackID }).exec()

    if ( feedback.ownerID.equals(user._id) ) {
        
        await feedback.deleteOne({_id: feedbackID})

        user.featuredFeedback = user.featuredFeedback.filter((feedbackID) => !feedback._id.equals(feedbackID))
        user.markModified('featuredFeedback')
        await user.save()

        res.sendStatus(200)
    } else {
        return res.status(400).json({"message": "You can only delete your own feedback!"})
    }
}

// GET request to /feedback/:id
const getFeedback = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })
    const feedback = await Feedback.findOne({_id: req.params.id}).exec()

    if (!feedback) {
        return res.status(204).json({ 'message': `Feedback ID ${req.params.id} not found` })
    }

    res.json(feedback)
}

// GET request to /feedback/user/:id
const getUserFeedbacks = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })

    if (!req?.query?.page) {
        const feedbacks = await Feedback.find({ownerID: req.params.id}).sort({ createdAt: -1 }).exec()
        res.json(feedbacks)
    }

    const page = req.query.page
    const offset = (page - 1) * 3

    try {
        
        const fetchedFeedbacks = await Feedback.paginate({ownerID: req.params.id}, { offset, limit: 3, sort: { createdAt: -1 } })
        res.json(fetchedFeedbacks)

    } catch (error) {
        res.status(500).json({"message": error.message})
    }
}

// GET request to /feedback/artwork/:id
const getArtworkFeedbacks = async (req ,res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })
    const feedbacks = await Feedback.find({artworkID: req.params.id}).sort({ createdAt: -1 }).exec()
    res.json(feedbacks)
}

const updateFeedback = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })

    const feedback = await Feedback.findOne({_id: req.params.id}).exec()

    if (!feedback) return res.status(404).json({ "message": 'Feedback with given ID could not be found.' })

    const updatedFeedback = excludeField(req.body, 'userID')

    if (req.body.userID !== updatedFeedback.ownerID) return res.status(403).json({ "message": 'You can only update your own feedbacks' })

    await feedback.updateOne(updatedFeedback)
    await feedback.save()
    res.sendStatus(200)
}

// POST request to /feedback
const postFeedback = async (req, res) => {
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to post artworks' })

    const user = await User.findOne({_id: req.body.userID}).exec()

    if (!user) {
        res.status(400).json({'message': 'No user with your ID'})
    }
    
    const feedback = excludeField(req.body, 'userID')

        try {
            const result = await Feedback.create(feedback)

            user.featuredFeedback.push(result._id)
            
            await user.save()
            res.status(201).json({ 'success': `New feedback ${feedback} created!` })
        } catch (err) {
            res.status(500).json({ 'message': err.message })
        }
}

module.exports = {
    rateFeedback,
    deleteFeedback,
    updateFeedback,
    getFeedback,
    postFeedback,
    getArtworkFeedbacks,
    getUserFeedbacks
}