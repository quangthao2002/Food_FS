import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ result: "Success", message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};
//  all food list
const allFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ result: "Success", data: foods });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};
// remove food item
const removeFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodModel.findOne({ _id: id });
    fs.unlinkSync(`uploads/${food.image}`);
    await foodModel.findOneAndDelete({ _id: id });
    res.json({ result: "Success", message: "Food Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};
export { addFood, allFood, removeFood };
