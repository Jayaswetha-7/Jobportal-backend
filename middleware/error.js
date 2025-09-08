const ErrorResponse = require("../utilis/errorResponse");


const errorHandler =(err,req,res,next) =>{
    let error = {...err}
    error.message = err.message

    if (err.name ==="castError") {
        const message =`resourse not found ${err.message}`
        error = new ErrorResponse (message, 404);
    }

    if (err.code === 11000) {
        const message =`duplicate field value entered ${err.message}`
        error = new ErrorResponse (message, 400);
    }

    if (err.name ==="validationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
         success: false,
         error: error.message || "server error"
    })
}

module.exports = errorHandler;