import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";



const router = express.Router();


router.post("/login", login);    
router.post("/register", register);
router.get("/protected", verifyToken);

export default router;