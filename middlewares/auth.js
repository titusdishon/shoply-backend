//check if user is authenticated or not
import User from "../models/user.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const {token} = req.cookies;
        if (!token) {
            return next(new ErrorHandler('Login first to access this resource ', 401))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
)
//handling users roles
export const authorizeRoles = (...roles) => catchAsyncErrors(
    async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not authorized to access this resource`, 403));
        }
        next();
    }
)