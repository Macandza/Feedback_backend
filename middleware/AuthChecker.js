const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger')

const AuthChecker = (req, res, next) => {
    // decode token
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']

    if (!token) {
        return res.status(403).send({
            Success : "False",
            Message : 'A token is required for authentication'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        // set req.user to decoded result
        req.user = decoded
    } catch (error) {
        return res.status(401).json({
            Success : "False",
            Message : "Invalid Token" 
        })
    }

    //call next
    return next()
}

module.exports = AuthChecker