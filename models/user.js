import mongoose from "mongoose";
import validator from "validator";

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
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  phoneNumber:{
      type: "string",
      retquired: [true, "Please enter your phoneNumber"],
      minLength: [10, "Please enter a valid phone number"],
      validate:[validator.phoneNumber, 'Invalid phone number provided']
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
  role:{
      type: "string",
      default:'user'
  },
  createdAt: {
      type:Date,
      default: Date.now();
  },
  resetPasswordToken:String,
  resetPasswordExpires: Date
});
