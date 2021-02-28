import express from "express";
import {
    createProductReview,
    deleteProduct,
    deleteReview,
    getAdminProducts,
    getProducts,
    getProductsReview,
    getSingleProduct,
    newProduct,
    updateProduct,
} from "../controllers/products.js";
import {isAuthenticatedUser} from "../middlewares/auth.js";

const router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Products Management
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *          - name
 *          - price
 *          - currency
 *          - description
 *          - rating
 *          - images
 *          - category
 *          - seller
 *          - numOfReviews
 *          - reviews
 *          - user
 *       properties:
 *          name:
 *             type: string
 *             description: product name
 *          price:
 *             type: number
 *             description: price of product
 *          currency:
 *             type:string
 *             description:currency for pricing
 *          description:
 *            type: string
 *            description: Product description
 *          rating:
 *            type: number
 *            description: rating
 *          images:
 *            type: array
 *            properties:
 *                image:
 *                   type: Object
 *                   properties:
 *                     public_id:
 *                        type: string
 *                     url:
 *                         type: string
 *          category:
 *            type: string
 *            enum: [Electronics,Cameras,Laptop,Accessories,Headphones,Food,Books,Clothes/Shoes,Beauty/Health,Sports,Outdoor,Home,new]
 *            description: Product category
 *          seller:
 *            type: string
 *            description: Product seller
 *          numberOfReviews:
 *            type: number
 *            description: Number of reviews on the product
 *          reviews:
 *            type: string
 *            description: Product reviews
 *          user:
 *            type: string
 *            description: User posting the product
 *       example:
 *         name: example name
 *         price: 20.99
 *         currency: KSH
 *         description: some description
 *         ratings: 22
 *         images:
 *            public_id: imageId
 *            url: imageUrl
 *         category: Electronics
 *         seller: string
 *         stock: number
 *         numOfReviews: 2
 *         reviews:
 *             user: userId
 *             name: 4some name
 *             rating: number
 *             comment: some comment
 *         user: some user id
 *
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewReview:
 *       type: object
 *       required:
 *         - review
 *       properties:
 *         review:
 *           type: array
 *           items:
 *             type: object
 *             parameters:
 *                  user:
 *                     type: string
 *                     description: user posting the review
 *                  name:
 *                     type: string
 *                     description: Logged in user name
 *                  rating:
 *                     type: number
 *                     description: rating given by the user
 *                  comment:
 *                     type: string
 *                     description: User comment on the product
 *       example:
 *         review:
 *            user: userId
 *            name: 4some name
 *            rating: number
 *            comment: some comment
 *
 */


router
    .route("/products")
    .get(getProducts);
/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Delete a user
 *     tags: [Products]
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

router.route("/product/:id").get(getSingleProduct);
/**
 * @swagger
 * /api/v1/admin/product/new:
 *   post:
 *     summary: Create a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.route("/admin/product/new").post(isAuthenticatedUser, newProduct);
/**
 * @swagger
 * /api/v1/admin/product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/v1/admin/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, updateProduct)
    .delete(isAuthenticatedUser, deleteProduct);
/**
 * @swagger
 * /api/v1/review:
 *   put:
 *     summary: Create a product review
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewReview'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewReview'
 *       500:
 *         description: Some server error
 */
router.route("/review").put(isAuthenticatedUser, createProductReview);
/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Get a product reviews
 *     tags: [Products]
 *     parameters:
 *       - in: query
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
 *               $ref: '#/components/schemas/NewReview'
 *       500:
 *         description: Some server error
 */
router.route("/reviews").get(isAuthenticatedUser, getProductsReview);
/**
 * @swagger
 * /api/v1/reviews:
 *   delete:
 *     summary: Delete a product review
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *       - in: query
 *         name: productId
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
router.route("/admin/review/delete").delete(isAuthenticatedUser, deleteReview);


/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products for admin users only
 *     tags: [Products]
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
//admin routes
router.route("/admin/products").get(isAuthenticatedUser, getAdminProducts);

export default router;
