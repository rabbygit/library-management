/*
 * BookLoan schema consists of  book(Book reference) , borrower (User reference) , status , borrowed_date
 *
 */

// Dependencies
const { Schema, model } = require('mongoose');

// Borrowed date will be set by timestamp
const schemaOptions = {
    timestamps: { createdAt: 'borrowed_date' },
};

// Define the BookLoan schema
const bookLoanSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrower: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "returned"]
    }
}, schemaOptions)

const BookLoan = model('BookLoan', bookLoanSchema)

// Export BookLoan Schema
module.exports = BookLoan;