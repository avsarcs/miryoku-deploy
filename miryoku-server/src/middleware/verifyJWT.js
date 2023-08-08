const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {

    if (req.method === 'GET' &&
        req.url !== '/user/me' &&
        req.url !== '/logout') return next()

    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log("status 403 triggered from verifyJWT")
                return res.sendStatus(403)
            } //invalid token
            req.body.userID = decoded.userID
            next()
        }
    )
}

module.exports = verifyJWT