import { Router } from "express";
import { getSingleUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", getSingleUser);

export default userRouter;
