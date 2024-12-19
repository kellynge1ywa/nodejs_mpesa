import express from "express";
import { confirmpayment, intitiateSTKPush, stkPushCallback } from "../controllers/lipaNaMpesaController.js";
import { accessToken } from "../middlewares/middlewares.js";

const router=express.Router();

router.route('/stkPush').post(accessToken, intitiateSTKPush);
router.route('/stkPushCallback/:OrderID').post(stkPushCallback);
router.route('/confirmPayment/:CheckoutRequestID').post(accessToken, confirmpayment);

export default router;