import express from "express";
import userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/allUsers",userController.getAllUsers);
userRouter.post("/signup",userController.signup);
userRouter.post("/login",userController.login);
userRouter.get("/userProfile/:id",userController.getUserProfile);
userRouter.put("/updateProfile/:id",userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id",userController.deleteUserProfile);
userRouter.put("/starRepository/:repoId", userController.starRepository);
userRouter.get("/starredRepositories/:userId", userController.getStarredRepositories);

export default userRouter;