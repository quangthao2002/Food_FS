import orderModel from "../models/orderModel.js";

import userModel from "./../models/userModel.js";
import nodemailer from "nodemailer";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// placing user
const placeOrder = async (req, res) => {
  const exchange_rate = 25000;
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    if (req.body.paymentMethod === "stripe") {
      const line_items = req.body.items.map((item) => {
        return {
          price_data: {
            currency: "vnd",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * exchange_rate, // đổi usd sang vnđ
          },
          quantity: item.quantity,
        };
      });

      // add price delivery charge
      line_items.push({
        price_data: {
          currency: "vnd",
          product_data: {
            name: "Delivery Charge",
          },
          unit_amount: 2 * exchange_rate,
        },
        quantity: 1,
      });
      const session = await stripe.checkout.sessions.create({
        //   payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${process.env.CLIENT_URL}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.status(200).json({
        success: true,
        session_url: session.url,
        paymentMethod: "stripe",
      });
    } else if (req.body.paymentMethod === "cod") {
      await orderModel.findByIdAndUpdate(newOrder._id, { payment: true });
      res.status(200).json({
        success: true,
        message: "Order placed with COD",
        paymentMethod: "cod",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment method not found" });
    }
    let productList = "";
    let totalAmount = 0;
    req.body.items.forEach((item) => {
      productList += `<li>Food name: ${item.name} x ${item.quantity} - ${item.price}$</li>`;
      totalAmount += item.price * item.quantity * exchange_rate;
    });
    const deliveryCharge = 2 * exchange_rate;
    const formatDeliveryCharge = deliveryCharge.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    totalAmount += deliveryCharge;
    const formattedAmount = totalAmount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.address.email,
      subject: "Order Confirmation",
      html: `
          <p>Thank you for your order! Your order ID is <strong>${newOrder._id}</strong>.</p>
          <p>Here are the details of your order:</p>
          <ul>
            ${productList}
          </ul>
          <p>Delivery Charge - 1 x ${formatDeliveryCharge} VND</p>
          <p><strong>Total Amount: ${formattedAmount} VND</strong></p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true, message: "Payment Success" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};
// order user from to font-end

const orderUser = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// listing orders for admin  panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
};
// get order by date
const getOrderByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  try {
    const orders = await orderModel.find(filter);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// getOrderStatistics
const getOrderStatistics = async (req, res) => {
  const { startDate, endDate } = req.query;
  const filter = {};
  if (startDate && endDate) {
    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    filter.date = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  try {
    const orders = await orderModel.find(filter);
    const totalOrder = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = acc[order.status] + 1 || 1;
      return acc;
    }, {});
    const paymentMethodCount = orders.reduce((acc, order) => {
      acc[order.paymentMethod] = acc[order.paymentMethod] + 1 || 1;
      return acc;
    }, {});
    const productCount = orders.reduce((acc, order) => {
      order.items.forEach((item) => {
        acc[item.name] = acc[item.name] + item.quantity || item.quantity;
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalOrder,
        totalRevenue,
        statusCount,
        paymentMethodCount,
        productCount,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, menubar: error.message });
  }
};
// update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export {
  placeOrder,
  verifyOrder,
  orderUser,
  listOrders,
  updateStatus,
  getOrderByDate,
  getOrderStatistics,
};
