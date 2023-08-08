const Opinion = require('../models/Opinion')

// POST request to /opinion
const postOpinion = async (req, res) => {
    try {
        const result = await Opinion.create(req.body)
        res.status(200).json({"message": "Opinion successfully submitted."})
    } catch (error) {
        res.status(500).json({'message': error.message})
    }
}

module.exports = {
    postOpinion
}