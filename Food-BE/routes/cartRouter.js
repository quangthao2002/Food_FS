import express from "express";
import {
  addToCart,
  getCart,
  removeCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeCart);
cartRouter.get("/get", authMiddleware, getCart);

export default cartRouter;
