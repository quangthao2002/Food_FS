import userModel from "./../models/userModel.js";

// add cart to userCart

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById({ _id: req.body.userId });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Item not added to cart" });
  }
};

// remove items from user cart
const removeCart = async (req, res) => {
  try {
    let userData = await userModel.findById({ _id: req.body.userId });
    let cartData = await userData.cartData;
    console.log(cartData);
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    console.log(cartData);
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Item remove from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Item not remove from cart" });
  }
};

// get user cart
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById({ _id: req.body.userId });
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Cart not found" });
  }
};

export { addToCart, removeCart, getCart };
