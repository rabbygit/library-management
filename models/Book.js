/*
 * Book schema consists of  name , author(Author reference)
 *
 */

// Dependencies
const { Schema, model } = require('mongoose');

// Define the Book schema
const bookSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
    }
})

const Book = model('Book', bookSchema)

// Export Book Schema
module.exports = Book;