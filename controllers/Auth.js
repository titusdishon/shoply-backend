import User from "../models/user.js";

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
//Register user =>/api/v1/register

export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "upload/v1612812435/sample",
            url:
                "https://res.cloudinary.com/titusdishon-com/image/upload/v1612812435/sample.jpg",
        },
    });
    sendToken(user, 200, res);
});


export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    if (!password || !email) {
        return next(new ErrorHandler("Please enter an email & password", 401))
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("invalid Email or password", 401))
    }
    sendToken(user, 200, res);
})
//logout user=>/api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new ErrorHandler('User with the email does not exist', 404))
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    //send email to the user for recovery purpose
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: "Email has been send to the account you have provided"
        })
    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))
    }
})

//logout user=>/api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: false
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})


//reset password
//logout user=>/api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()}
    });
    if (!user) {
        return next(new ErrorHandler('password recovery token has expired or is invalid', 400))
    }
    if (req.body.password !== req.body.confrimPassword) {
        return next(new ErrorHandler('Passwords do not match'))
    }
    user.password= req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res)
})