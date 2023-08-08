const User = require('../models/User')
const bcrypt = require('bcryptjs')

const handleNewUser = async (req, res) => {
    const { name, email, password, about, skills } = req.body
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' })

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create only the necessary fields in the xpBySkill property of the user
        const xpBySkill = {}

        skills.forEach(element => {
            const key = element.toLowerCase() + 'Xp'
            xpBySkill[key] = 0
        });
        


        //create and store the new user
        const result = await User.create({
            "name": name,
            "password": hashedPassword,
            "email": email,
            "about": about,
            "skills": skills,
            "level": 1,
            "xp": 10,
            "points": 100,
            "xpBySkill": xpBySkill,
            "title": "Novice",
            "profileStyle": {
                "nameStyle": {
                    "color": "#f7f2f2",
                    "textShadow": "-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black",
                    "fontSize": "5em",
                    "letterSpacing": "0.054em",
                    "fontFamily": "Pacifico, Gill Sans"
                },
                "aboutStyle": {
                    "padding": "1em",
                    "fontSize": "1.25em",
                    "border": "2px solid black",
                    "backgroundColor": "#ffffff",
                    "background": " linear-gradient(135deg, #e3e3e355 25%, transparent 25%) -22px 0/ 44px 44px, linear-gradient(225deg, #e3e3e3 25%, transparent 25%) -22px 0/ 44px 44px, linear-gradient(315deg, #e3e3e355 25%, transparent 25%) 0px 0/ 44px 44px, linear-gradient(45deg, #e3e3e3 25%, #ffffff 25%) 0px 0/ 44px 44px",
                    "fontFamily": "Gill Sans, Gill Sans MT, Calibri, 'Trebuchet MS', sans-serif"
                },
                "tabClass": "dark-bg",
                "backgroundImage": "url('../img/profile-bg-3.png')"
            },
            "featuredArtworks": [],
            "featuredFeedback": [],
            "stats": {
                "fbGiven": 0,
                "awPublished": 0
            },
            "awRatings": {},
            "likedComments": [],
            "likedCommentReplies": [],
            "feedbackRatings": {},
            "likedFbReplies" : [],
            "refreshToken": ""
        })


        res.status(201).json({ 'success': `New user ${result} created!` })
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleNewUser }