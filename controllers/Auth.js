import User from "../models/user.js";

import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

//Register user =>/api/v1/register

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
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

  res.status(201).json({
    success: true,
    user,
  });
});
