import express from "express";
import userRouter from "./user.router.js";

const router = express.Router();
router.use(userRouter);

router.get("/",(req,res) => {res.send("Welcome!");});

export default router;