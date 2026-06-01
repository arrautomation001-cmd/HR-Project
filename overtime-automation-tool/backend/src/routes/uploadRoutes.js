import express from "express";
import { uploadExcel } from "../controllers/uploadController.js";
import upload from "../middlewares/uploadMiddleware.js";


const router = express.Router();




router.get("/", (req, res) => {
  res.send("Upload Route Working");
});

router.post("/",upload.single("file"), uploadExcel);


export default router;