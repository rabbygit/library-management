/*
 * Books related routes
 *
 */

// Dependencies
const router = require('express').Router()
const {
    booksGetController,
    booksPostController,
    specificBooksGetController,
    booksPutController,
    booksDeleteController
} = require('../controllers/booksController')

const { isAdmin, isUser } = require('../middlewares/authMiddleware')


// Get all books
// Accessible to system user (member / admin)
router.get('/', isUser, booksGetController)

// Create a new book
// Accessible to admin
router.post('/', isAdmin, booksPostController)

// Get a specific book
// Accessible to system user (member / admin)
router.get('/:id', isUser, specificBooksGetController)

// Update a book
// Accessible to admin
router.put('/:id', isAdmin, booksPutController)

// Delete a book
// Accessible to admin
router.delete('/:id', isAdmin, booksDeleteController)

// Export the router
module.exports = router