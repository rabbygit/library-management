/*
 * This middleware will determine user authorization
 *
 */

// Dependencies
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.isAdmin = async (req, res, next) => {
    console.log("HELLLLLLLLLLL")
    // Gather the jwt access token from the request header
    const token = req.headers['authorization']

    // If there is no token then return with 401 status code
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }

    try {
        // Verify the token
        const userId = await jwt.verify(token, process.env.SECRET_KEY);

        if (!userId.id) {
            let error = new Error("Forbidden")
            error.status = 403
            throw error
        }

        // Find the user with id
        let user = await User.findById(userId.id)

        if (!user || user.role != 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        next()

    } catch (error) {
        if (['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(error.name)) {
            error.status = 401
            error.message = 'Unauthorized'
            next(error)
        } else {
            next(error)
        }

    }
}