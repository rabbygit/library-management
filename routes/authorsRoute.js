/*
 * Author related routes
 *
 */

// Dependencies
const router = require('express').Router()
const {
    authorsGetController,
    authorsPostController,
    authorsPutController,
    authorsDeleteController,
    specificAuthorsGetController
} = require('../controllers/authorsController');

const { isAdmin, isUser } = require('../middlewares/authMiddleware')

// Create a new author
// Accessible : Admin
router.post('/', isAdmin, authorsPostController)

// Get all authors
// Access : System user(member / admin)
router.get('/', isUser, authorsGetController)

// Get an existing author
// Accessible : System user(member / admin)
router.get('/:id', isUser, specificAuthorsGetController)

// Update an existing author
// Accessible : Admin
router.put('/:id', isAdmin, authorsPutController)

// Delete an existing author
// Accessible : Admin
router.delete('/:id', isAdmin, authorsDeleteController)

// Export the router
module.exports = router