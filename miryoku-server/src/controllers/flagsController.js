const User = require('../models/User')
const Flag = require('../models/Flag')
const excludeField = require('../util/excludeField')

// POST request to /flag
const postFlag = async (req, res) => {
    if (!req.body.userID) return res.status(403).json({ "message": 'You must be signed in to raise flags' })

    const user = User.findOne({_id: req.body.userID}).exec()
    const flag = excludeField(req.body, 'userID')

    if (!user) return res.status(400).json({ "message": 'User authentication faulty' })

    try {
        const result = await Flag.create(flag)

        res.status(201).json({ 'success': `New flag ${flag} created!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }

}

// DELETE request to /flag/:id
const deleteFlag = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    if (!req?.params?.id) return res.status(400).json({"message": "Flag ID not provided"})

    const flagID = req.params.id
    const flag = await Flag.findOne({ _id: flagID }).exec()

    if ( flag.submitterID === user._id ) {
        await Flag.deleteOne({_id: flagID})
    } else {
        return res.status(400).json({"message": "You can only delete your own flag!"})
    }
}

// GET request to /flag/:id
const getFlag = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Flag ID required' })
    const flag = await Flag.findOne({_id: req.params.id}).exec()

    if (!flag) {
        return res.status(204).json({ 'message': `Flag ID ${req.params.id} not found` })
    }

    res.json(flag)
}

module.exports = {
    postFlag,
    deleteFlag,
    getFlag
}