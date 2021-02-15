import express from "express";
import {
  newProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductsReview,
  deleteReview,
} from "../controllers/products.js";
import { isAuthenticatedUser, authorizeRoles } from "../middlewares/auth.js";
const router = express.Router();
router
  .route("/products")
  .get( getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/admin/product/new").post(isAuthenticatedUser, newProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductsReview);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

export default router;
