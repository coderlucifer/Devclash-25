import express from "express";
//import {userLogin, userLogout, userPurchases, userSignup} from "../controllers/usercontroller.js";
import { studentSignup } from "../controllers/studentControllres.js";

const router = express.Router();

router.post("/signup",studentSignup)
//router.post("/login",userLogin)

export default router