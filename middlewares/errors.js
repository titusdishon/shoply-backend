import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack,
        });
    }

    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = {...err};
        error.message = err.message;

        //Wrong mongodb error handling
        if (err.name === "CastError") {
            const message = `Resource not found. Invalid:${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        //validation error handling
        if (err.name === "ValidatorError") {
            const message = Object.values(err.errors).map((value) => value.message);
            error = new ErrorHandler(message, 400);
        }
        // handle mongoose duplicate key errors
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400)
        }

        //wrong jwt error
        if (err.name === "JsonWebTokenError") {
            const message = 'JSON Web Token Is Invalid, Please Try Again';
            error = new ErrorHandler(message, 400);
        }
        //wrong jwt error
        if (err.name === "TokenExpiredError") {
            const message = 'JSON Web Token Is Expired, Please Try Again';
            error = new ErrorHandler(message, 400);
        }
        res.status(err.statusCode).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
