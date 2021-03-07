/*
 * Profile picture upload controller
 *
 */

// Dependencies
const User = require('../models/User')

exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            let profile_pic = `/uploads/${req.file.filename}`;

            // Find and update the user's profile picture
            let user = await User.findOneAndUpdate(
                { _id: req.userId },
                { $set: { profile_pic } },
                { new: true }).exec()

            // Construct the new member object with updated profile picture
            let new_user = {
                _id: user._id,
                name: user.name,
                profile_pic: user.profile_pic
            }

            // Response
            res.status(200).json({
                success: true,
                message: 'Profile picture uploaded successfully',
                user: new_user
            })

        } catch (error) {
            next(error)
        }
    } else {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}