import express from 'express'
import { createProducts, deleteProduct, deleteProductReviews, getAllProducts, getProductReviews, getSingleProduct, updateProduct, updateProductforReview } from '../controller/productController.js';
import { roleBasedAccess, verifyUserAuth } from "../middleware/verifyUserAuth.js";
const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/admin/products").get(verifyUserAuth,roleBasedAccess("Admin"),getAllProducts);
router.route("/admin/product/create").post(verifyUserAuth,roleBasedAccess("Admin"),createProducts)
router.route("/admin/product/:id").put(verifyUserAuth,roleBasedAccess("Admin"),updateProduct).delete(verifyUserAuth,roleBasedAccess("Admin"),deleteProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUserAuth,updateProductforReview);
router.route("/reviews").get(getProductReviews).delete(verifyUserAuth,deleteProductReviews);
export default router;