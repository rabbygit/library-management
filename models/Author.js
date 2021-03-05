/*
 * Author schema consists of  name and bio
 *
 */

// Dependencies
const { Schema, model } = require('mongoose');

// Define the Author schema
const authorSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    bio: String
})

const Author = model('Author', authorSchema)

// Export Author Schema
module.exports = Author;