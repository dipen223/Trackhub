import express from "express";
import repoController from "../controllers/repoController.js";

const repoRouter = express.Router();

repoRouter.post("/repo/create",repoController.createRepository);
repoRouter.get("/repo/all",repoController.getAllRepos);
repoRouter.get("/repo/:id",repoController.fetchRepoById);
repoRouter.get("/repo/name/:name",repoController.fetchRepoByName);
repoRouter.get("/repo/user/:userId",repoController.fetchRepoForCurrentUser);
repoRouter.put("/repo/update/:id",repoController.updateRepoById);
repoRouter.patch("/repo/toggle/:id",repoController.toggleVisibilityById);
repoRouter.delete("/repo/delete/:id",repoController.deleteRepoById);

export default repoRouter;

