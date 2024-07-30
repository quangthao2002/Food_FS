import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getOrderByDate,
  getOrderStatistics,
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
orderRouter.get("/list-orders-by-date", getOrderByDate);
orderRouter.get("/order-statistics", getOrderStatistics);
orderRouter.post("/status", updateStatus);

export default orderRouter;
