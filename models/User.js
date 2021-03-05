/*
 * User schema consists of  name , email , password , profile_pic and role
 *
 */

// Dependencies
const { Schema, model } = require('mongoose');

// Email validator
const validateEmail = function (email) {
    const emailChecker = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailChecker.test(email)
};

// Define the user schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'E-mail is not valid']
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    profilePicture: {
        type: String,
        default: "/uploads/default.png"
    },
    role: {
        type: String,
        default: "member",
        enum: ["admin", "member"]
    },
})


const User = model('User', userSchema)

// Export the User schema
module.exports = User;