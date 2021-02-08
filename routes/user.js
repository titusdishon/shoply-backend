import express from "express";

const router = express.Router();

import { registerUser } from "../controllers/Auth.js";

router.route("/register").post(registerUser);

export default router;
