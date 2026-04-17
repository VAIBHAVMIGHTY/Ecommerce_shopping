import express from "express";
const router = express.Router();
import { register,login, logout, forgotPasswordToken, resetPasswordToken, getUserDetails, updatePassword, updateProfile, getUserList, getSingleUserList, updateUserRole, deleteUser } from "../controller/userController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/verifyUserAuth.js";


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout)
router.route("/password/forgot").post(forgotPasswordToken);
router.route("/reset/:token").post(resetPasswordToken);
router.route("/profile").get(verifyUserAuth,getUserDetails);
router.route("/password/update").put(verifyUserAuth,updatePassword);
router.route("/profile/update").put(verifyUserAuth,updateProfile);
router.route("/admin/users").get(verifyUserAuth,roleBasedAccess("Admin"),getUserList);
router.route("/admin/user/:id").get(verifyUserAuth,roleBasedAccess("Admin"),getSingleUserList).put(verifyUserAuth,roleBasedAccess("Admin"),updateUserRole).delete(verifyUserAuth,roleBasedAccess("Admin"),deleteUser);
export default router;