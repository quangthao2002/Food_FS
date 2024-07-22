import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  let image_url = req.file.location; //URL cua anh tren s3
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    image: image_url,
  });
  try {
    await food.save();
    res.json({ result: "Success", message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};

// update food item
const updateFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await foodModel.findOne({ _id: id });
    let image_url = food.image; // nếu không thay đổi sử dụng lại image cũ
    if (req.file) {
      // Xóa ảnh cũ trên S3 nếu cần
      const oldImageKey = food.image.split("/").pop();
      await s3
        .deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldImageKey,
        })
        .promise();

      image_url = req.file.location; // URL của ảnh mới trên S3
    }
    await foodModel.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: image_url,
      }
    );
    res.json({ result: "Success", message: "Food Updated" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};
// remove food item
const removeFood = async (req, res) => {
  const { id } = req.params;
  try {
    await foodModel.findOneAndDelete({ _id: id });
    res.json({ result: "Success", message: "Food Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};

// get food by id
const getFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await foodModel.findById(id).exec();
    res.json({ result: "Success", data: food });
  } catch (error) {
    console.log(error.message);
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
// food pagination

const paginationFood = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const result = {};

  try {
    const totalItems = await foodModel.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / limit);

    const foods = await foodModel.find().limit(limit).skip(startIndex).exec();
    // page = 4, limit =10, startIndex = 30
    result.data = foods;
    result.totalPages = totalPages;
    result.currentPage = page;

    if (page < totalPages) {
      result.nextPage = Number(page) + 1;
    }
    if (page > 1) {
      result.prevPage = page - 1;
    }
    res.json({ result: "Success", data: result });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error", message: error.message });
  }
};
export { addFood, allFood, removeFood, paginationFood, updateFood, getFood };
