/*
 * Books related controller
 * 
 */

// Dependencies
const Author = require('../models/Author')
const Book = require('../models/Book')

// Get all books
// Required field : none
exports.booksGetController = async (req, res, next) => {
    try {
        let books = await Book.find({})
        res.status(200).json({
            success: true,
            books
        })
    } catch (error) {
        next(error)
    }
}

// Create a new book
// Required field : name and author_id
exports.booksPostController = async (req, res, next) => {
    // Object destructuring
    let { name, author_id } = req.body;

    // Sanity check
    name = typeof (name) == 'string' && name.trim().length ? name.trim() : false;
    author_id = typeof (author_id) == 'string' && author_id.trim().length ? author_id.trim() : false;

    // if name or author_id is not present
    if (!name || !author_id) {
        return res.status(400).json({
            success: true,
            message: 'Bad Request'
        })
    }

    try {
        // Find the author by author_id
        let author = await Author.findById(author_id).exec()

        // Check if author exist
        if (!author) {
            let error = new Error("Author doesn't exist")
            error.status = 404
            throw error
        }

        // Construct new book
        let new_book = new Book({
            name,
            author: author_id
        })

        // Save the book
        await new_book.save()

        res.status(201).json({
            success: true,
            message: "New book created successfully",
            book: new_book
        })
    } catch (error) {
        next(error)
    }
}


// Get a specific book
// Required field : id
exports.specificBooksGetController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    try {
        // Find the author
        let book = await Book.findById(id).populate('author').exec();

        // If author doesn't exist
        if (!book) {
            let error = new Error("Book doesn't exist")
            error.status = 404
            throw error
        }

        // Response with author
        res.status(200).json({
            success: true,
            book
        })
    } catch (error) {
        next(error)
    }
}


// Update a book
// Required field : id
// Optional field : name or author_id
exports.booksPutController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    // Get name and bio from request body
    let { name, author_id = '' } = req.body

    // Sanity check
    name = typeof (name) == 'string' && name.trim().length ? name.trim() : false;
    author_id = typeof (author_id) == 'string' && author_id.trim().length ? author_id.trim() : false;

    // if name and author_id are not present , then nothing to update
    if (!name && !author_id) {
        return res.status(400).json({
            success: true,
            message: 'Bad Request'
        })
    }

    try {
        // Find the book 
        let book = await Book.findById(id).exec()

        // If book doesn't exist
        if (!book) {
            let error = new Error("Book doesn't exist")
            error.status = 404
            throw error
        }

        // if author is to be changed then check if author exists
        if (author_id) {
            let author = await Author.findById(author_id).exec()

            // Check if author exist
            if (!author) {
                let error = new Error("Author doesn't exist")
                error.status = 404
                throw error
            }
        }

        // Construct the new book that will be updated
        let book_to_change = {
            name: name ? name : book.name,
            author: author_id ? author_id : book.author
        }

        // Find the book and update
        let updated_book = await Book.findByIdAndUpdate(
            { _id: id },
            book_to_change,
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            book: updated_book
        })
    } catch (error) {
        next(error)
    }
}

// Delete a book
// Required field : id 
exports.booksDeleteController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    try {
        // Find the book 
        let book = await Book.findById(id).exec()

        // If book doesn't exist
        if (!book) {
            let error = new Error("Book doesn't exist")
            error.status = 404
            throw error
        }

        // Find the book and delete
        await Book.findByIdAndDelete({ _id: id })

        res.status(200).json({
            success: true,
            message: "Book deleted successfully."
        })
    } catch (error) {
        next(error)
    }
}

