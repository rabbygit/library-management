/*
 * Authentication route
 *
 */

// Dependencies
const router = require('express').Router();
const {
    signupPostController,
    loginPostController,
} = require('../controllers/authController')

// Signup route
router.post('/signup', signupPostController)

// Login route
router.post('/login', loginPostController)

// Export the router
module.exports = router;