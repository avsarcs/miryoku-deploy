const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' })

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)

    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "userID": foundUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        )

        const refreshToken = jwt.sign(
            { "userID": foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '5d' }
        )

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }) // httpOnly: true, sameSite: 'Strict', secure: true 

        // Send access token to user
        res.json({ accessToken, id: foundUser?._id })
    } else {
        return res.sendStatus(400)
    }

}

module.exports = { handleLogin }