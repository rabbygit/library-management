/*
 * Books related routes
 *
 */

// Dependencies
const router = require('express').Router()
const { booksGetController } = require('../controllers/booksController')
const { isAdmin } = require('../middlewares/authMiddleware')

router.get('/', isAdmin, booksGetController)


module.exports = router