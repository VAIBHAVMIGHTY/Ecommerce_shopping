import express from 'express';
import { verifyUserAuth } from '../middleware/verifyUserAuth.js';
import { processPayment, sendAPIKey } from '../controller/paymentController.js';
const router=express.Router();

router.route('/payment/process').post(verifyUserAuth,processPayment)
router.route('/getKey').get(verifyUserAuth,sendAPIKey)
export default router;