const User = require('../models/User')

// DELETE request to /user
const deleteUser = async (req, res) => {
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.body.userID }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }
    await user.deleteOne({ _id: req.body.userID })
}

// GET request to /user/me
const getMe = async (req, res) => {
    
    if (!req?.body?.userID) return res.status(400).json({ "message": 'User ID required (You are not signed in)' })
    const user = await User.findOne({ _id: req.body.userID }).exec()

    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
    }

    res.json(user)
}

// GET request to /user/minimal/:id
const getUserMinimal = async (req, res) => {
    try {
        if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
        const user = await User.findOne({_id: req.params.id}).select("name level").exec()

        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.body.userID} not found` })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
    
}

// GET request to /user/:id
const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })
    const user = await User.findOne({ _id: req.params.id }).exec()
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` })
    }
    res.json(user)
}

// PATCH request to /user/:id
const updateUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' })

    const updatedUser = req.body
    if (req.body.userID !== req.params.id) {
        console.log("This is a req.body.userID situation")
        return res.status(403).json({ "message": 'You can only update your own profile.' })
    }


    try {
        const user = await User.findOne({ _id: req.params.id }).exec()
        
        if (!user) {
            return res.status(404).json({ "message": 'User not found' })
        }

        if (user.nameChanged) {
            delete updatedUser.nameChanged

        } else if (updatedUser.name !== user.name) {
            
                updatedUser.nameChanged = true
        }
        
        user.set(updatedUser); // Update user fields
        await user.save();
        
        res.status(200).json({ "message": 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": 'An error occurred while updating the user' });
    }
}

module.exports = {
    deleteUser,
    getMe,
    getUser,
    updateUser,
    getUserMinimal
}