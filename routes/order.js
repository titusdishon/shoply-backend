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
const router = express.Router();
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizeRoles("user"), getOrder);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrder);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("user"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("user"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("user"), deleteOrder);

export default router;
