import express from "express";
import userRouter from "./user.router.js";
import repoRouter from "./repo.router.js"
import issueRouter from "./issue.router.js";

const router = express.Router();

router.use(userRouter);
router.use(repoRouter);
router.use(issueRouter);

router.get("/",(req,res) => {res.send("Welcome!");});

export default router;