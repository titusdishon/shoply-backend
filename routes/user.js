import express from "express";

const router = express.Router();
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserDetails,
  updateUser,
  deactivateUser,
} from "../controllers/Auth.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
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
