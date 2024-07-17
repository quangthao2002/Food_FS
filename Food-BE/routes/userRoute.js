import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.post("/loginUser", loginUser);
userRouter.post("/registerUser", registerUser);

export default userRouter;
