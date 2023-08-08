const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: 'Novice'
    },
    skills: {
        type: Array
    },
    nameChanged: {
        type: Boolean,
        default: false
    },
    level: {
        type: Number
    },
    xp: {
        type: Number
    },
    points: {
        type: Number
    },
    xpBySkill: {
        musicianXp: {
            type: Number
        },
        writerXp: {
            type: Number
        },
        directorXp: {
            type: Number
        },
        painterXp: {
            type: Number
        },
        poetXp: {
            type: Number
        },
        photographerXp: {
            type: Number
        },
        otherXp: {
            type: Number
        }
    },
    profileStyle: {
        type: Schema.Types.Mixed
    },
    featuredArtworks: [{ type: Schema.Types.ObjectId, ref: 'Artwork' }],
    featuredFeedback: {
        type: Array
    },
    stats: {
        fbGiven: {
            type: Number
        },
        awPublished: {
            type: Number
        }
    },
    awRatings: {
        type: Schema.Types.Mixed,
        default: {}
    },
    likedComments: {
        type: Array
    },
    likedCommentReplies: {
        type: Array
    },
    feedbackRatings: {
        type: Schema.Types.Mixed
    },
    likedFbReplies: {
        type: Array
    },
    refreshToken: {
        type: String
    }
}, { minimize: false })

userSchema.methods.newArtwork = async function (artwork) {
    const user = this
    const userObject = user.toObject()

    if (userObject.points < 10) return false

    let xpType
    switch (artwork.type) {
        case "Fiction":
            xpType = "writerXp"
            break;
        case "Poetry":
            xpType = "poetXp"
            break;
        case "Cinema":
            xpType = "directorXp"
            break;
        case "Photography":
            xpType = "photographerXp"
            break;
        case "Painting":
            xpType = "painterXp"
            break;
        case "Music":
            xpType = "musicianXp"
            break;
        case "Other":
            xpType = "otherXp"
            break;
    }

    let skillIdentity
    switch (artwork.type) {
        case "Fiction":
            skillIdentity = "Writer"
            break;
        case "Poetry":
            skillIdentity = "Poet"
            break;
        case "Cinema":
            skillIdentity = "Director"
            break;
        case "Photography":
            skillIdentity = "Photographer"
            break;
        case "Painting":
            skillIdentity = "Painter"
            break;
        case "Music":
            skillIdentity = "Musician"
            break;
        case "Other":
            skillIdentity = "Other"
            break;
    }

    if (!user.skills.includes(skillIdentity)) {
        user.skills.push(skillIdentity)
    }

    console.log("xpType is: " + xpType)
    let xpGained = (( Math.floor(Math.random() * 150) + 101 )
    * (1 + (parseInt(userObject.level) * 0.328))) / 10

    xpGained = parseInt(xpGained.toFixed(0))
    let oldXp = userObject.xp;
    userObject.xp += xpGained

    userObject.xpBySkill[xpType] = userObject.xpBySkill[xpType] + xpGained || xpGained
    console.log("now, userObject.xpBySkill is: " + userObject.xpBySkill)
    let oldLevel = userObject.level
    // Reflect every change you make on this for loop on the StatsWidget on the front end
    for (let newLevel = 1; newLevel < 10000; newLevel++) {

        if ( 60 * ( newLevel * Math.log10(newLevel) ) > userObject.xp ) {
            userObject.level = newLevel - 1;
            break;
        }

        if (newLevel === 9999) userObject.level = newLevel
    }

    if (userObject.level !== oldLevel) {
        userObject.xp = userObject.xp - oldXp
        if (userObject.xp === 0) {
            userObject.xp++
        }
    }

    if (userObject.level >= 5) {
        userObject.title = "Enthusiast"
    } else if (userObject.level >= 10) {
        userObject.title = "Apprentice"
    } else if (userObject.level >= 15) {
        userObject.title = "Visionary"
    } else if (userObject.level >= 20) {
        userObject.title = "Artisan"
    } else if (userObject.level >= 25) {
        userObject.title = "Proficient"
    } else if (userObject.level >= 30) {
        userObject.title = "Prolific"
    } else if (userObject.level >= 35) {
        userObject.title = "Elite"
    } else if (userObject.level >= 40) {
        userObject.title = "Art Connoisseur"
    } else if (userObject.level >= 45) {
        userObject.title = "Maestro"
    } else if (userObject.level >= 50) {
        userObject.title = "Virtuoso"
    } else if (userObject.level >= 100) {
        userObject.title = "Legendary"
    }

    userObject.points -= 10
    
    user.xp = userObject.xp;
    user.level = userObject.level;
    user.title = userObject.title;
    user.points = userObject.points;
    user.xpBySkill[xpType] = userObject.xpBySkill[xpType];

    console.log("user.xpBySkill is now: " + JSON.stringify(user.xpBySkill))

    try {
        await user.save()
    } catch (error) {
        console.error(error)
    }

    return true
}

userSchema.methods.toJSON = function () {
    try {
        const user = this
        const userObject = user.toObject()

        delete userObject.password
        delete userObject.refreshToken

        return userObject
    } catch (error) {
        return this
    }
    
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)
 
    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}

// Associates User to its artworks
userSchema.virtual('artworks', {
    ref: 'Artwork',
    localField: '_id',
    foreignField: 'ownerID'
})

// Delete user artworks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Artwork.deleteMany({ ownerID: user._id })
    next()
})

userSchema.pre('save', async function (next) {
    const user = this

    if (!user.profileStyle.backgroundColor && user.profileStyle.backgroundColor !== null) {
        delete user.profileStyle.backgroundColor
    }

    if (!user.profileStyle.background && user.profileStyle.background !== null) {
        delete user.profileStyle.background
    }

    if (!user.profileStyle.nameStyle.textShadow && user.profileStyle.nameStyle.textShadow !== null) {
        delete user.profileStyle.nameStyle.textShadow
    }

    next()
})

// Hash passwords before saving the user to the database
// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User