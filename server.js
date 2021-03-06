/*
 * Entry file of application
 *
 */

// Dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require("cors");
const setRoute = require('./routes/routes');

// Create server 
const app = express()

// Enable All CORS Requests
app.use(cors())

// Add public folder
app.use(express.static(path.join(__dirname, 'public')));

// Accept json and url encoded payload
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Set all routes
setRoute(app)

// If requested url doesn't match , throw  error with 404 status code
app.use((req, res, next) => {
    let error = new Error('Not Found')
    error.status = 404
    next(error)
})

// Custom Error handler
app.use((error, req, res, next) => {
    // Check if error object has proper status code and message then send response with the given status code and message
    if (typeof (error.status) == 'number' && error.message) {
        return res.status(error.status).json({
            success: false,
            message: error.message
        })
    }

    // Handle server error
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
})

// Get server port and database URL from environment if exists otherwise from config file
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.MONGODB_URL


// Database connection and Starting server
mongoose.
    connect(DB_URL,
        { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, autoIndex: false })
    .then(() => {
        console.log('\x1b[33m%s\x1b[0m', `Database connected`)

        app.listen(PORT, () => {
            console.log('\x1b[33m%s\x1b[0m', `Server is listening on ${PORT}`)
        })
    }).catch(e => {
        return console.log(e.message)
    })