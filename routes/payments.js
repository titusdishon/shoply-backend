import express from "express";
import {isAuthenticatedUser} from "../middlewares/auth.js";
import {processStripePayment, sendStripeApiKey} from "../controllers/payment.js";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processStripePayment);
router.route("/stripe-api").get(isAuthenticatedUser, sendStripeApiKey);

export default router;
