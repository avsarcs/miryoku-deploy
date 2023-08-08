require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/mongoose')
const PORT = process.env.PORT || 3001

// Connect to MongoDB
connectDB()

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'build')))

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', '..index.html'));
});

// routes
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

// verifyJWT does not check for authentication for GET requests
// Authentication is not needed to view the site
app.use(verifyJWT)
app.use('/opinion', require('./routes/api/opinions'))
app.use('/user', require('./routes/api/users'))
app.use('/artwork', require('./routes/api/artworks'))
app.use('/feedback', require('./routes/api/feedbacks'))
app.use('/comment', require('./routes/api/comments'))
app.use('/reply', require('./routes/api/replies'))
app.use('/flag', require('./routes/api/flags'))

// app.all('*', (req, res) => {
//     res.status(404)

//     if (req.accepts('json')) {
//         res.json({ "error": "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// })

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
});