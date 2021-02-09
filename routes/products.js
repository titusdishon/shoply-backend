import express from "express";
import {
  newProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";
import {isAuthenticatedUser, authorizeRoles} from "../middlewares/auth.js";
const router = express.Router();
router.route("/products").get(isAuthenticatedUser,authorizeRoles('admin'),getProducts);
router.route("/product/:id").get(getSingleProduct);
router.route("/admin/product/new").post(isAuthenticatedUser,newProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser,updateProduct).delete(isAuthenticatedUser,deleteProduct);

export default router;
