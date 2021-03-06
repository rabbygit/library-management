/*
 * Authors related controller
 * 
 */

// Dependencies
const Author = require('../models/Author')

// Get all authors
// Required field : none
exports.authorsGetController = async (req, res, next) => {
    try {
        let authors = await Author.find({})
        res.status(200).json({
            success: true,
            authors
        })
    } catch (error) {
        next(error)
    }
}

// Get a specific author
// Required field : id
exports.specificAuthorsGetController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    try {
        // Find the author
        let author = await Author.findById(id).exec();

        // If author doesn't exist
        if (!author) {
            let error = new Error("Auhtor doesn't exist")
            error.status = 404
            throw error
        }

        // Response with author
        res.status(200).json({
            success: true,
            author
        })
    } catch (error) {
        next(error)
    }
}

// Create a new author
// Required field : Name
// Optional field : bio
exports.authorsPostController = async (req, res, next) => {
    // Object destructuring
    let { name, bio = '' } = req.body;

    // Sanity check
    name = typeof (name) == 'string' && name.trim().length ? name.trim() : false;

    // if name is not present
    if (!name) {
        return res.status(400).json({
            success: true,
            message: 'Bad Request'
        })
    }

    try {
        // Check if author already exists
        let author = await Author.findOne({ name })

        if (author) {
            let error = new Error('Author already exists')
            error.status = 409
            throw error
        }

        // Construct new author object
        let new_author = new Author({
            name,
            bio
        })

        // Save the author
        await new_author.save()

        // Successful Response
        res.status(201).json({
            success: true,
            message: 'Author successfully created !',
            author: new_author
        })

    } catch (error) {
        next(error)
    }
}

// Update a author
// Required field : id and name
// Optional field : bio
exports.authorsPutController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    // Get name and bio from request body
    let { name, bio = '' } = req.body

    // Sanity check
    name = typeof (name) == 'string' && name.trim().length ? name.trim() : false;

    // if name is not present
    if (!name) {
        return res.status(400).json({
            success: true,
            message: 'Bad Request'
        })
    }

    try {
        // Find the author and update
        let updated_author = await Author.findByIdAndUpdate(
            { _id: id },
            {
                name,
                bio
            },
            { new: true }
        )

        res.status(204).json({
            success: true,
            message: 'Author updated successfully',
            author: updated_author
        })
    } catch (error) {
        next(error)
    }
}


// Delete a author
// Required field : id 
exports.authorsDeleteController = async (req, res, next) => {
    // Get id from request params object
    let { id } = req.params

    try {
        // Find the author and delete
        await Author.findByIdAndDelete({ _id: id })
        res.status(200).json({
            success: true,
            message: "Author deleted successfully."
        })
    } catch (error) {
        next(error)
    }
}
