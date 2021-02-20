import User from "../models/user.js";

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

//Register user =>/api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "e-avatars",
        width: 150,
        crop: "scale",
    });

    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url,
        },
    });
    sendToken(user, 200, res);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {

    const {email, password} = req.body;
    if (!password || !email) {
        return next(new ErrorHandler("Please enter an email & password", 401));
    }
    const user = await User.findOne({email}).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    if (!user.isActive) {
        return next(new ErrorHandler("Your account has beed suspended", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("invalid Email or password", 401));
    }
    sendToken(user, 200, res);
});
//logout user=>/api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new ErrorHandler("User with the email does not exist", 404));
    }
    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});
    //send email to the user for recovery purpose
    const resetUrl = `http://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n If you have not requested this email please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Email has been send to the account you have provided",
        });
    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message, 500));
    }
});

//logout user=>/api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: false,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

//reset password
//logout user=>/api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()},
    });
    if (!user) {
        return next(
            new ErrorHandler("password recovery token has expired or is invalid", 400)
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match"));
    }
    user.password = req.body.password;
    user.updatedAt = new Date(Date.now());
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
    res.status(200).json({
        success: true,
    });
});

//get the logged in user and =>/api/v1/me

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

//change password for the currently logged in user => /api/v1/password/update

export const changePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // check previous user password-
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler("Old password is incorrect"));
    }

    //check whether the user has entered thesame password as the current
    const isCurrent = await user.comparePassword(req.body.password);
    if (isCurrent) {
        return next(
            new ErrorHandler(
                "You have entered your current password, please choose a different one"
            )
        );
    }
    user.password = req.body.password;
    user.updatedAt = new Date(Date.now());
    await user.save();
    sendToken(user, 200, res);
});

//update user profile =>/api/v1/me/update

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        updatedAt: new Date(Date.now()),
    };
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id);
        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);
        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "e-avatars",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user,
    });
});

//ADMIN ROUTES
//get all the user in database =>/api/v1/user/all

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const numberOfUsers = await User.countDocuments();
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
        numberOfUsers,
    });
});

//get user details =>/api/v1/user/details

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new ErrorHandler(
                `User with the provided id ${req.params.id} is not found`
            )
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

//update user  profile admin function =>/api/v1/admin/user/:id

export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        updatedAt: new Date(Date.now()),
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

//delete user (this is not a real user delete functionality, we justy deactivate the account and they will not be able to login)
// api=>/api/user/delete;

export const deactivateUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(
                `User with the provided id ${req.params.id} does not exist`
            )
        );
    }
    //if the user was to be deleted, we would have to remove their avatar from the cloudinary server

    user.isActive = false;
    user.save();

    res.status(200).json({
        success: true,
        message: "User has been successfully deleted",
    });
});
