import express from "express";

const router = express.Router();

import {forgotPassword, loginUser, logoutUser, registerUser, resetPassword} from "../controllers/Auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/reset/:token").post(resetPassword)
export default router;
