import express from "express";
import {authorizeRoles, isAuthenticatedUser} from "../middlewares/auth.js";
import {
    changePassword,
    deactivateUser,
    forgotPassword,
    getAllUsers,
    getUserDetails,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updateUser,
    updateUserProfile,
} from "../controllers/Auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User Management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Your email address
 *         password:
 *           type: string
 *           description: Your password
 *       example:
 *         email: titusdishon@gmail.com
 *         password: '********'
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       required:
 *         - email
 *         - phoneNumber
 *         - name
 *         - isActive
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User name
 *         phoneNumber:
 *           type: string
 *           description: User phone number
 *         isActive:
 *           type:boolean
 *           description:Should the user be activated at creation?
 *         email:
 *           type: string
 *           description: Your email address
 *         password:
 *           type: string
 *           description: Your password
 *       example:
 *         name: example name
 *         isActive: true
 *         phoneNumber: +254000000000
 *         email: example@example.com
 *         password: '********'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfile:
 *       type: object
 *       required:
 *         - email
 *         - phoneNumber
 *         - name
 *         - isActive
 *       properties:
 *         name:
 *           type: string
 *           description: User name
 *         phoneNumber:
 *           type: string
 *           description: User phone number
 *         isActive:
 *           type:boolean
 *           description:Should the user be activated at creation?
 *         email:
 *           type: string
 *           description: Your email address
 *       example:
 *         name: example name
 *         isActive: true
 *         phoneNumber: +254000000000
 *         email: example@example.com
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Logout:
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GetMany:
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Forgot:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: Your email address
 *       example:
 *           email: example@example.com
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Success:
 *       type: object
 *       required:
 *         - success
 *       properties:
 *         success:
 *           type: boolean
 *           description: "success event"
 *       example:
 *           email: you have successfully
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reset:
 *       type: object
 *       required:
 *         - password
 *         - confirmPassword
 *       properties:
 *         password:
 *           type: string
 *           description: new password
 *         confirmPassword:
 *           type: string
 *           description: New Password confirmation
 *       example:
 *           password: 1234&A222
 *           confirmPassword: 1234&A222
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - password
 *         - oldPassword
 *         - confirmPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           description: Your current password
 *         password:
 *           type: string
 *           description: new password
 *         confirmPassword:
 *           type: string
 *           description: New Password confirmation
 *       example:
 *           oldPassword: 1234&A222
 *           password: 1234&A222
 *           confirmPassword: 1234&A222
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login to your account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Some server error
 */
router.route("/login").post(loginUser);
/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Successfully registered in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 */
router.route("/register").post(registerUser);
/**
 * @swagger
 * /api/v1/logout:
 *   get:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logout'
 *       500:
 *         description: Some server error
 */

router.route("/logout").get(logoutUser);
/**
 * @swagger
 * /api/v1/password/forgot:
 *   post:
 *     summary: Forgot
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Forgot'
 *     responses:
 *       200:
 *         description: Successfully registered in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */
router.route("/password/forgot").post(forgotPassword);
/**
 * @swagger
 * /api/v1/password/reset/{token}:
 *   post:
 *     summary: Reset your password
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reset'
 *     responses:
 *       200:
 *         description: Password successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reset'
 *       500:
 *         description: Some server error
 */


router.route("/password/reset/:token").post(resetPassword);

/**
 * @swagger
 * /api/v1/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Auth]
 *     requestBody:
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       500:
 *         description: Some server error
 */
router.route("/me").get(isAuthenticatedUser, getUserProfile);

/**
 * @swagger
 * /api/v1/password/update:
 *   post:
 *     summary: Update your password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Some server error
 */

router.route("/password/update").put(isAuthenticatedUser, changePassword);


/**
 * @swagger
 * /api/v1/me/update:
 *   post:
 *     summary: Update your profile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateProfile'
 *       500:
 *         description: Some server error
 */
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
/**
 * @swagger
 * /api/v1/admin/users/all:
 *   get:
 *     summary: Get my profile
 *     tags: [Auth]
 *     requestBody:
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMany'
 *       500:
 *         description: Some server error
 */
router
    .route("/admin/users/all")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
/**
 * @swagger
 * /api/v1/user/details/{id}:
 *   get:
 *     summary: Get my profile
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *            type: string
 *            required: true
 *     requestBody:
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMany'
 *       500:
 *         description: Some server error
 */
router
    .route("/user/details/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
/**
 * @swagger
 * /api/v1/admin/user/update/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
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
 *             $ref: '#/components/schemas/UpdateProfile'
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
    .route("/admin/user/update/:id")
    .put(isAuthenticatedUser, authorizeRoles("user", "admin"), updateUser);
/**
 * @swagger
 * /api/v1/admin/user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Auth]
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
    .route("/admin/user/delete/:id")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deactivateUser);
export default router;
