import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  orderUser,
  placeOrder,
  updateStatus,
  verifyOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/placeOrder", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.get("/userOrders", authMiddleware, orderUser);
orderRouter.get("/listOrders", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
