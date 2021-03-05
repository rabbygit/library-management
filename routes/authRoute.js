const router = require('express').Router();

const {
    signupPostController,
    loginPostController,
} = require('../controllers/authController')

router.post('/signup', signupPostController)

router.post('/login', loginPostController)

module.exports = router;