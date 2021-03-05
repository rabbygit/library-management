/*
 * Authentication controller
 * 
 */

// Dependencies
const bcrypt = require('bcrypt');
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
            password: hasedPassword,
        })

        // Save new user
        await new_user.save();

        // Response back
        res.status(200).json({
            success: true,
            message: 'Library member registered successfully'
        })
    } catch (error) {
        next(error)
    }
}


exports.loginPostController = async (req, res, next) => {
    res.status(200).send("Login")
}

