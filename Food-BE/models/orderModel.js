import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: { type: String, require: true },
  items: { type: Array, require: true },
  amount: { type: Number, require: true },
  address: { type: Object, require: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: String, default: false },
  paymentMethod: { type: String, require: true },
});
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
