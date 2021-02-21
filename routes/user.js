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
router.route("/register").post(registerUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, changePassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
router
    .route("/users/all")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router
    .route("/user/details/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails);
router
    .route("/admin/user/update/:id")
    .put(isAuthenticatedUser, authorizeRoles("user", "admin"), updateUser);
router
    .route("/admin/user/delete/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), deactivateUser);
export default router;
