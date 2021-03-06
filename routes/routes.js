/*
 * Route defination of the application
 *
 */

// Dependencies
const authRoute = require('./authRoute');
const booksRoute = require('./booksRoute');


// Routes and their relative handler
const routes = [
    {
        path: '/api/auth',
        handler: authRoute
    },
    {
        path: '/api/books',
        handler: booksRoute
    },
    {
        path: '/',
        handler: (req, res) => {
            res.status(200).send("Welcome To Library Management System.")
        }
    }
]

// Use the handler for related route
module.exports = app => {
    routes.forEach(route => {
        if (route.path == '/') {
            app.get(route.path, route.handler) // Root route
        } else {
            app.use(route.path, route.handler)
        }
    })
}