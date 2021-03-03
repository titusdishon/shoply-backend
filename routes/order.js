import express from "express";
import {
  newOrder,
  getOrder,
  getMyOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/order.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Orders Management
 */


//order model

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *          - shippingInfo
 *          - user
 *          - orderItems
 *          - paymentInfo
 *          - itemsPrice
 *          - taxPrice
 *          - shippingPrice
 *          - totalPrice
 *          - orderStatus
 *       properties:
 *          totalPrice:
 *            type: string
 *          shippingPrice:
 *            type: number
 *          taxPrice:
 *            type: number
 *            description: tax amount
 *          orderStatus:
 *            type: string
 *          paidAt:
 *            type: string
 *            description: Payment time
 *          deliveredAt:
 *            type: string
 *          createdAt:
 *            type: string
 *          user:
 *            type: string
 *          paymentInfo:
 *            type: object
 *            description: payment  information
 *            properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *          orderItems:
 *            type: array
 *            properties:
 *                name:
 *                   type: string
 *                image:
 *                   type: string
 *                quantity:
 *                   type: number
 *                price:
 *                   type: number
 *                product:
 *                   type: string
 *          shippingInfo:
 *            type: object
 *            description: delivery address
 *            properties:
 *                 address:
 *                    type: string
 *                 city:
 *                    type: string
 *                 phoneNumber:
 *                    type: string
 *                 postalCode:
 *                    type: string
 *                 country:
 *                    type: string
 *       example:
 *         taxPrice: some tax price
 *         shippingPrice: 20.99
 *         totalPrice: 400
 *         orderStatus: processing
 *         deliveredAt: Time of delivery (Not required)
 *         createdAt: Time of creation
 *         shippingInfo:
 *            city: Nairobi
 *            address: Some place
 *            phoneNumber: +25400000000000
 *            postalCode: some postal Code
 *            country: Kenya
 *         user: userId
 *         seller: string
 *         stock: number
 *         numOfReviews: 2
 *         orderItems:
 *             - name: product name
 *               image: product image url
 *               quantity: number being ordered
 *               price: price of the item
 *               product: product id
 *             - name: product name
 *               image: product image url
 *               quantity: number being ordered
 *               price: price of the item
 *               product: product id
 *         paymentInfo:
 *             id: transaction id
 *             status: succeeded
 *         paidAt: date and time of payment(Not required)
 *
 */

/**
 * @swagger
 * /api/v1/order/new:
 *   post:
 *     summary: create an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
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

const router = express.Router();
router.route("/order/new").post(isAuthenticatedUser, newOrder);
/**
 * @swagger
 * /api/v1/order/{id}:
 *   get:
 *     summary: Get all orders for admin users only
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizeRoles("user","admin"), getOrder);
/**
 * @swagger
 * /api/v1/orders/me:
 *   get:
 *     summary: Get all my orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */
router.route("/orders/me").get(isAuthenticatedUser, getMyOrder);
/**
 * @swagger
 * /api/v1/admin/orders:
 *   get:
 *     summary: Get all orders for admin users only
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("user",'admin'), getAllOrders);
/**
 * @swagger
 * /api/v1/admin/order/{id}:
 *   delete:
 *     summary: Get all orders for admin users only
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /api/v1/admin/order/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /api/v1/admin/order/{id}:
 *   delete:
 *     summary: delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
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
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("user","admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("user","admin"), deleteOrder);

export default router;
