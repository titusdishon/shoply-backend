import express from "express";
import {isAuthenticatedUser} from "../middlewares/auth.js";
import {processStripePayment, sendStripeApiKey} from "../controllers/payment.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Orders Management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *          amount:
 *             type: number
 *             description: amount paid
 */

/**
 * @swagger
 * /api/v1/payment/process:
 *   post:
 *     summary: place a payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */
router.route("/payment/process").post(isAuthenticatedUser, processStripePayment);
router.route("/stripe-api").get(isAuthenticatedUser, sendStripeApiKey);

export default router;
