/*
 * Book-loans related controller
 *
 */

// Dependencies
const excel = require("exceljs");
const BookLoan = require("../models/BookLoan")
const Book = require('../models/Book')

// Request a book loan by a library member
// Required field : book_id 
// Optional field : none
exports.bookLoansPostController = async (req, res, next) => {
    // get the book_id from request body
    let { book_id } = req.body

    // Sanity check
    book_id = typeof (book_id) == 'string' && book_id.trim().length ? book_id.trim() : false

    // If book_id or userId is not present 
    if (!book_id || !req.userId) {
        return res.status(400).json({
            success: true,
            message: 'Bad Request'
        })
    }

    try {
        // Find the book if exists
        let book = await Book.findById(book_id).exec()

        // If book doesn't exist
        if (!book) {
            let error = new Error("Book doesn't exist")
            error.status = 404
            throw error
        }

        // Check if the same member already request the same book before and
        // book is in pending or accepted then don't allow the user to request again
        let book_loan = await BookLoan.findOne({ book: book_id, borrower: req.userId, status: { $in: ['pending', 'accepted'] } }).exec()

        // Already book loan is in pending or accepted
        if (book_loan) {
            let message = book_loan.status == 'pending' ? 'Your have already requested for this book' : 'Please return the book before requesting again'
            let error = new Error(message)
            error.status = 400
            throw error
        }

        // Construct new book-loan
        let new_book_loan = new BookLoan({
            book: book_id,
            borrower: req.userId
        })

        // Save the book loan
        await new_book_loan.save()

        // Response
        res.status(201).json({
            success: true,
            message: "Request for book loan successfully made",
            book_loan: new_book_loan
        })
    } catch (error) {
        next(error)
    }
}

// Accept a book loan by library admin
// Required field : book_loan_id
exports.bookLoanAcceptController = async (req, res, next) => {
    // Get book loan id
    let { book_loan_id } = req.params

    // Sanity check
    book_loan_id = typeof (book_loan_id) == 'string' && book_loan_id.trim().length ? book_loan_id.trim() : false;

    // If book_loan_id or userId is not present 
    if (!book_loan_id || !req.userId) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request'
        })
    }

    try {
        // Find the book loan and make sure if loan is pending
        let book_loan = await BookLoan.findOne({ _id: book_loan_id, status: 'pending' }).exec()

        // if book not found or not in pending status
        if (!book_loan) {
            let error = new Error("Book Loan doesn't exist or Loan is not pending")
            error.status = 400
            throw error
        }

        // Update the status to accepted
        let updated_book_loan = await BookLoan.findByIdAndUpdate(book_loan_id, { status: 'accepted' }, { new: true }).populate('book borrower', 'name').exec()

        // Response 
        res.status(200).json({
            success: true,
            message: 'Book loan request accepted',
            book_loan: updated_book_loan
        })
    } catch (error) {
        next(error)
    }
}

// Reject a book loan by library admin
// Required field : book_loan_id
exports.bookLoanRejectController = async (req, res, next) => {
    // Get book loan id
    let { book_loan_id } = req.params

    // Sanity check
    book_loan_id = typeof (book_loan_id) == 'string' && book_loan_id.trim().length ? book_loan_id.trim() : false;

    // If book_loan_id or userId is not present 
    if (!book_loan_id || !req.userId) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request'
        })
    }

    try {
        // Find the book loan and make sure if loan is pending
        let book_loan = await BookLoan.findOne({ _id: book_loan_id, status: 'pending' }).exec()

        // if book not found or not in pending status
        if (!book_loan) {
            let error = new Error("Book Loan doesn't exist or Loan is not pending")
            error.status = 400
            throw error
        }

        // Update the status to rejected
        let updated_book_loan = await BookLoan.findByIdAndUpdate(book_loan_id, { status: 'rejected' }, { new: true }).populate('book borrower', 'name').exec()

        // Response 
        res.status(200).json({
            success: true,
            message: 'Book loan request rejected',
            book_loan: updated_book_loan
        })
    } catch (error) {
        next(error)
    }
}

// Return a book loan by library admin
// Required field : book_loan_id
exports.bookLoanReturnController = async (req, res, next) => {
    // Get book loan id
    let { book_loan_id } = req.params

    // Sanity check
    book_loan_id = typeof (book_loan_id) == 'string' && book_loan_id.trim().length ? book_loan_id.trim() : false;

    // If book_loan_id or userId is not present 
    if (!book_loan_id || !req.userId) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request'
        })
    }

    try {
        // Find the book loan and make sure if loan is in accepted state
        let book_loan = await BookLoan.findOne({ _id: book_loan_id, status: 'accepted' }).exec()

        // if book not found or not in accepted status
        if (!book_loan) {
            let error = new Error("Book Loan doesn't exist or Loan is not accepted yet !")
            error.status = 400
            throw error
        }

        // Update the status to returned
        let updated_book_loan = await BookLoan.findByIdAndUpdate(book_loan_id, { status: 'returned' }, { new: true }).populate('book borrower', 'name').exec()

        // Response 
        res.status(200).json({
            success: true,
            message: 'Book returned',
            book_loan: updated_book_loan
        })
    } catch (error) {
        next(error)
    }
}

// View a book loans of an user
// Required field : none
exports.bookLoansGetController = async (req, res, next) => {
    // If userId is not present 
    if (!req.userId) {
        return res.status(400).json({
            success: false,
            message: 'Bad Request'
        })
    }

    try {
        // Find all the book loans of the member
        let book_loans = await BookLoan.find({ borrower: req.userId }).populate('book borrower', 'name').exec()

        // No available book loans
        if (!book_loans.length) {
            // Response 
            return res.status(200).json({
                success: false,
                book_loans: []
            })
        }

        // Response 
        res.status(200).json({
            success: true,
            book_loans
        })
    } catch (error) {
        next(error)
    }
}

// Export excel file of book loan data
// Required field : none
exports.bookLoanExportExcelController = async (req, res, next) => {
    try {
        // Fin all documents of book loan collection
        let book_loans = await BookLoan.find().populate('book borrower').exec()

        let formated_book_loans = []

        // Format the data 
        book_loans.forEach(loan => {
            // Construct the object
            let obj = {
                _id: loan._id,
                status: loan.status,
                book: loan.book.name,
                borrower: loan.borrower.name
            }

            // Push the constructed object
            formated_book_loans.push(obj)
        })

        // Create new workbook
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("BookLoans");

        // Define column header and key
        worksheet.columns = [
            { header: "Id", key: "_id", width: 30 },
            { header: "Book", key: "book", width: 25 },
            { header: "Borrower", key: "borrower", width: 25 },
            { header: "Status", key: "status", width: 10 },
        ];

        // Add Array Rows
        worksheet.addRows(formated_book_loans);

        // Set header to support file attachment
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "BookLoans.xlsx"
        );

        // Response back the excel file
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (error) {
        next(error)
    }
}