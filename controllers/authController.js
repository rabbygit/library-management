/*
 * Authentication controller
 * 
 */

// Dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validateEmail } = require('../utils/emailValidator')

// Library member creation
// Required field : name , email , password
exports.signupPostController = async (req, res, next) => {
    // Object destructuring
    let { name, email, password } = req.body;

    // Sanity check
    name = typeof (name) == 'string' && name.trim().length ? name.trim() : false;
    email = typeof (email) == 'string' && email.trim().length && validateEmail(email) ? email.trim() : false;
    password = typeof (password) == 'string' && password.trim().length ? password.trim() : false

    try {
        //  Incorrect name , email or password
        if (!name || !email || !password) {
            let error = new Error("Bad Request")
            error.status = 400
            throw error
        }

        // Check if user already exists
        let user = await User.findOne({ email })

        if (user) {
            let error = new Error('User already exists')
            error.status = 409
            throw error
        }

        // Hash the password
        let hasedPassword = await bcrypt.hash(password, 11)

        // Construct the user type of member
        let new_user = new User({
            name,
            email,
            password: hasedPassword
        })

        // Save new user
        await new_user.save();

        // Response back
        res.status(201).json({
            success: true,
            message: 'Library member registered successfully'
        })
    } catch (error) {
        next(error)
    }
}

// User login controller
// Required field : email and password
exports.loginPostController = async (req, res, next) => {
    // Object destructuring
    let { name, email, password } = req.body;

    // Sanity check
    email = typeof (email) == 'string' && email.trim().length && validateEmail(email) ? email.trim() : false;
    password = typeof (password) == 'string' && password.trim().length ? password.trim() : false
    try {
        //  Incorrect email or password
        if (!email || !password) {
            let error = new Error("Bad Request")
            error.status = 400
            throw error
        }

        // Find the user by email
        let user = await User.findOne({ email })

        // If user doesn't exist
        if (!user) {
            let error = new Error('Invalid credentials')
            error.status = 401
            throw error
        }

        // Compare the password
        let match = await bcrypt.compare(password, user.password)

        // If password doesn't match
        if (!match) {
            let error = new Error('Invalid credentials')
            error.status = 401
            throw error
        }

        // Create token
        let token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });


        // Response back
        res.status(200).json({
            success: true,
            message: 'Successfully logged in.',
            token
        })
    } catch (error) {
        next(error)
    }
}

