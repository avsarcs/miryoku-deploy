const User = require('../models/User')
const Reply = require('../models/Reply')
const excludeField = require('../util/excludeField')

// POST request to /reply/:id
const toggleReplyLike = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Reply ID required' })
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to like replies' })

    const reply = await Reply.findOne({ _id: req.params.id }).exec()
    const ratingUser = await User.findOne({ _id: req.body.userID }).exec()

    if (!reply) return res.status(400).json({ "message": 'Reply with given ID could not be found' })
    if (!ratingUser) return res.status(400).json({ "message": 'User authentication faulty' })
    
    let replyType
    if (reply.for === 'comment') { replyType = 'likedCommentReplies' }
    else { replyType = 'likedFbReplies' }


    if ( ratingUser[replyType].includes(reply._id) ) {
        // Delete the reply from the likedReplies array of the user
        ratingUser[replyType] =
            ratingUser[replyType].filter( replyID => !replyID.equals(reply._id))
        
        // Decrement reply likes
        reply.likes--
    } else {
        ratingUser[replyType].push(reply._id)
        reply.likes++
    }

    await ratingUser.save()
    await reply.save()
    res.sendStatus(200)
}

// POST request to /reply
const postReply = async (req, res) => {
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to post replies' })

    const user = await User.findOne({_id: req.body.userID}).exec()
    const reply = excludeField(req.body, 'userID')

    if (!user) return res.status(400).json({ "message": 'User authentication faulty' })

    try {
        const result = await Reply.create(reply)

        res.status(201).json({ 'success': `New reply ${reply} created!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

// DELETE request to /reply/:id
const deleteReply = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    if (!req?.params?.id) return res.status(400).json({"message": "Reply ID not provided"})

    const replyID = req.params.id
    const reply = await Reply.findOne({ _id: replyID }).exec()

    if ( reply.ownerID.equals(user._id) ) {
        await Reply.deleteOne({_id: replyID})
        res.sendStatus(200)
    } else {
        return res.status(400).json({"message": "You can only delete your own reply!"})
    }
}

// PATCH request to /reply/:id
const updateReply = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Reply ID required' })

    const reply = await Reply.findOne({_id: req.params.id}).exec()

    if (!reply) return res.status(404).json({ "message": 'Reply with given ID could not be found.' })

    const updatedReply = excludeField(req.body, 'userID')

    if (req.body.userID !== reply.ownerID) return res.status(403).json({ "message": 'You can only update your own comments' })

    await reply.updateOne(updatedReply)
    await reply.save()
}

// GET request to /reply/:id
const getReply = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Reply ID required' })
    const reply = await Reply.findOne({_id: req.params.id}).exec()

    if (!reply) {
        return res.status(204).json({ 'message': `Reply ID ${req.params.id} not found` })
    }

    res.json(reply)
}

// GET request to /reply/feedback/:id
const getFeedbackReplies = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })
    
    const replies = await Reply.find({for: "feedback", parentID: req.params.id}).exec()
    res.json(replies)

}

// GET request to /reply/comment/:id
const getCommentReplies = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Feedback ID required' })
    
    const replies = await Reply.find({for: "comment", parentID: req.params.id}).exec()

    res.json(replies)

}

module.exports = {
    toggleReplyLike,
    postReply,
    deleteReply,
    updateReply,
    getReply,
    getFeedbackReplies,
    getCommentReplies
}