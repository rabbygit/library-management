/*
 * Profile picture upload related routes
 *
 */

// Dependencies
const router = require('express').Router()
const { isMember } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')
const {
    uploadProfilePics,
} = require('../controllers/uploadController')


// Uploading profile picture of an member
// Accessible to only library member
router.post('/profile-picture', isMember, upload.single('profile_picture'), uploadProfilePics)


// export the router
module.exports = router