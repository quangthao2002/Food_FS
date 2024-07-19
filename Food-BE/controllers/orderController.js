import orderModel from "../models/orderModel.js";

import userModel from "./../models/userModel.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
            unit_amount: item.price * exchange_rate,
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
// listing orders for admin admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
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
export { placeOrder, verifyOrder, orderUser, listOrders, updateStatus };
