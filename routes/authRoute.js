import express from "express";

import {
    registerController,
    loginController, 
    testController, 
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()

// routing
// REGISTER || Method:post
router.post("/register", registerController);

// login || post
router.post("/login", loginController);


router.post("/forgot-password", forgotPasswordController);

// test route
router.get("/test", requireSignIn, isAdmin, testController);

//update profile
router.put("/profile", requireSignIn, updateProfileController);

// protected route
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
},);

// admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
},);

router.get("/orders", requireSignIn, getOrdersController);

router.get("/all-orders", requireSignIn,isAdmin, getAllOrdersController);

router.put("/order-status/:orderId", requireSignIn,isAdmin, orderStatusController);



export default router;