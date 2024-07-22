import express from "express";
import {
  addFood,
  allFood,
  getFood,
  paginationFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";
import multer from "multer";
const foodRouter = express.Router();
// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // set  thu muc luu images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list/pagination", paginationFood);
foodRouter.get("/list-food", allFood);
foodRouter.delete("/remove/:id", removeFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);
foodRouter.get("/getfood/:id", getFood);
export default foodRouter;
