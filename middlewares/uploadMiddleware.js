/*
 * Upload middleware for uploading image
 *
 */
// Dependencies
const multer = require('multer');
const path = require('path')

// storing files to disk public/uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
})

// upload function
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5  // Max file size : 5 MB
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/ // Allwoed file types
        const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimeType = types.test(file.originalname);

        if (extName && mimeType) {
            cb(null, true)
        } else {
            cb(new Error("Only Support Images"))
        }
    }
})

// Export upload function
module.exports = upload