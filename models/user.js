import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
const userSchema = new mongoose.Schema({
    name: {
        type: "string",
        required: [true, "Please enter your name"],
        maxLength: [30, "Name can not exceed 30 characters"],
    },
    email: {
        type: "string",
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: "string",
        retquired: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    phoneNumber: {
        type: "string",
        retquired: [true, "Please enter your phoneNumber"],
        minLength: [10, "Please enter a valid phone number"],
    },
    avatar: {
        public_id: {
            type: "string",
            required: true,
        },
        url: {
            type: "string",
            required: true,
        },
    },
    role: {
        type: "string",
        default: "user",
    },
    isActive: {
        type: "boolean",
        required: true,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

//Encrypt password before saving the user to the database
userSchema.pre("save", async function (next) {
    if (this.isModified(this.password)) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//return jwt token after user is registered

userSchema.methods.getJwtToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};

userSchema.methods.getResetPasswordToken= function (){
    //generate reset token for password recovery
    const resetToken= crypto.randomBytes(20).toString('hex');
    // hash the reset token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //set the expiry time for the token
    this.resetPasswordExpires = Date.now()+30*60*1000
    return resetToken
}

export default mongoose.model("User", userSchema);
