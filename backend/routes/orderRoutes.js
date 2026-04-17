import express from "express";
import { allMyOrders, createOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/verifyUserAuth.js";
const router = express.Router();

router.route("/new/order").post(verifyUserAuth,createOrder);
router.route("/admin/order/:id")
.get(verifyUserAuth,roleBasedAccess("Admin"),getSingleOrder)
.put(verifyUserAuth,roleBasedAccess("Admin"),updateOrderStatus)
.delete(verifyUserAuth,roleBasedAccess("Admin"),deleteOrder);
router.route("/orders/user").get(verifyUserAuth,allMyOrders);
router.route("/admin/orders").get(verifyUserAuth,roleBasedAccess("Admin"),getAllOrders)

export default router;