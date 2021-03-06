/*
 * Books related controller
 * 
 */


exports.booksGetController = async (req, res, next) => {
    res.status(200).json({
        success: true
    })
}

// User login controller
// Required field : email and password
exports.loginPostController = async (req, res, next) => {
    // Object destructuring
    let { name, email, password } = req.body;

    // Sanity check
    email = typeof (email) == 'string' && email.trim().length && validateEmail(email) ? email.trim() : false;
    password = typeof (password) == 'string' && password.trim().length ? password.trim() : false
    try {
        //  Incorrect email or password
        if (!email || !password) {
            let error = new Error("Bad Request")
            error.status = 400
            throw error
        }

        // Find the user by email
        let user = await User.findOne({ email })

        // If user doesn't exist
        if (!user) {
            let error = new Error('Invalid credentials')
            error.status = 401
            throw error
        }

        // Compare the password
        let match = await bcrypt.compare(password, user.password)

        // If password doesn't match
        if (!match) {
            let error = new Error('Invalid credentials')
            error.status = 401
            throw error
        }

        // Create token
        let token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: 86400 // expires in 24 hours
        });


        // Response back
        res.status(200).json({
            success: true,
            message: 'Successfully logged in.',
            token
        })
    } catch (error) {
        next(error)
    }
}

