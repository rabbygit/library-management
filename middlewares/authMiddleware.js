/*
 * This middleware will determine user authorization
 *
 */

// Dependencies
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Verify an admin from request header's token
exports.isAdmin = async (req, res, next) => {
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
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded.id) {
            let error = new Error("Forbidden")
            error.status = 403
            throw error
        }

        // Find the user with id
        let user = await User.findById(decoded.id)

        // if user is not an admin
        if (!user || user.role != 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        // Set the userId to use in controller
        req.userId = decoded.id

        // User is admin
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

// Verify a member from request header's token
exports.isMember = async (req, res, next) => {
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
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded.id) {
            let error = new Error("Forbidden")
            error.status = 403
            throw error
        }

        // Find the user with id
        let user = await User.findById(decoded.id)

        // Check user is a member
        if (!user || user.role != 'member') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        // Set the userId to use in controller
        req.userId = decoded.id

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

// Verify a member or admin from request header's token
exports.isUser = async (req, res, next) => {
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
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded.id) {
            let error = new Error("Forbidden")
            error.status = 403
            throw error
        }

        // Find the user with id
        let user = await User.findById(decoded.id)

        // User doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        // Set the userId to use in controller
        req.userId = decoded.id
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