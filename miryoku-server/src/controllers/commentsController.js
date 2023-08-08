const User = require('../models/User')
const Comment = require('../models/Comment')
const excludeField = require('../util/excludeField')

// POST request to /comment/:id
const toggleCommentLike = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Comment ID required' })
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to like comments' })

    const comment = await Comment.findOne({ _id: req.params.id }).exec()
    const ratingUser = await User.findOne({ _id: req.body.userID }).exec()

    if (!comment) return res.status(400).json({ "message": 'Comment with given ID could not be found' })
    if (!ratingUser) return res.status(400).json({ "message": 'User authentication faulty' })
    

    if ( ratingUser.likedComments.includes(comment._id) ) {

        // Delete the comment from the likedComments array of the user
        ratingUser.likedComments =
            ratingUser.likedComments.filter( (commentID) => {
                return !commentID.equals(comment._id)
            })
        
        // Decrement comment likes
        comment.likes--
    } else {
        ratingUser.likedComments.push(comment._id)
        comment.likes++
    }

    ratingUser.markModified('likedComments')
    await ratingUser.save()
    await comment.save()
    res.sendStatus(200)
}

// POST request to /comment
const postComment = async (req, res) => {
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to post artworks' })

    const user = User.findOne({_id: req.body.userID}).exec()
    const comment = excludeField(req.body, 'userID')

    if (!user) return res.status(400).json({ "message": 'User authentication faulty' })

    try {
        const result = await Comment.create(comment)

        res.status(201).json({ 'success': `New comment ${comment} created!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

// DELETE request to /comment/:id
const deleteComment = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    console.log("You are inside deleteComment!")
    console.log("req.params.id is: " + req.params.id)

    if (!req?.params?.id) return res.status(400).json({"message": "Comment ID not provided"})

    const commentID = req.params.id
    const comment = await Comment.findOne({ _id: commentID }).exec()

    if ( comment.commenterID.equals(user._id) ) {
        await Comment.deleteOne({_id: commentID})
        res.sendStatus(200)
    } else {
        return res.status(400).json({"message": "You can only delete your own comment!"})
    }
}

// PATCH request to /comment/:id
const updateComment = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Comment ID required' })

    const comment = await Comment.findOne({_id: req.params.id}).exec()

    if (!comment) return res.status(404).json({ "message": 'Comment with given ID could not be found.' })

    const updatedComment = excludeField(req.body, 'userID')

    if (req.body.userID !== updatedComment.ownerID) return res.status(403).json({ "message": 'You can only update your own comments' })

    await comment.updateOne(updatedComment)
    await comment.save()
}

// GET request to /comment/artwork/:id
const getArtworkComments = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Artwork ID required' })
    const comments = await Comment.find({artworkID: req.params.id}).exec()
    res.json(comments)
}

// GET request to /comment/:id
const getComment = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Comment ID required' })
    const comment = await Comment.findOne({_id: req.params.id}).exec()

    if (!comment) {
        return res.status(204).json({ 'message': `Comment ID ${req.params.id} not found` })
    }

    res.json(comment)
}

module.exports = {
    toggleCommentLike,
    postComment,
    deleteComment,
    updateComment,
    getComment,
    getArtworkComments
}