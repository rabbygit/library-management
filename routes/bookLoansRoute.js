/*
 * Book-Loans related routes
 *
 */

// Dependencies
const router = require('express').Router()
const {
    bookLoansPostController,
    bookLoansGetController,
    bookLoanAcceptController,
    bookLoanRejectController,
    bookLoanReturnController,
    bookLoanExportExcelController
} = require('../controllers/bookLoansController')

const { isAdmin, isMember } = require('../middlewares/authMiddleware')

// Request for a book-loan
// Accessible to library member
router.post('/', isMember, bookLoansPostController)

// View book-loans
// Accessible to library member
router.get('/', isMember, bookLoansGetController)

// Accept a book-loan request
// Accessible to admin
router.get('/accept/:book_loan_id', isAdmin, bookLoanAcceptController)

// Reject a book-loan request
// Accessible to admin
router.get('/reject/:book_loan_id', isAdmin, bookLoanRejectController)

// Return a book-loan 
// Accessible to admin
router.get('/return/:book_loan_id', isAdmin, bookLoanReturnController)

// Eexport  book-loans data as excel file 
// Accessible to admin
router.get('/export-excel', isAdmin, bookLoanExportExcelController)

// Export the router
module.exports = router