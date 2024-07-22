import express from "express";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import {
  addFood,
  allFood,
  getFood,
  paginationFood,
  removeFood,
  updateFood,
} from "../controllers/foodController.js";

// Load environment variables from .env file
dotenv.config();

// Khởi tạo S3 client với AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Cấu hình multer với multer-s3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`); // tên file
    },
  }),
});

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list/pagination", paginationFood);
foodRouter.get("/list-food", allFood);
foodRouter.delete("/remove/:id", removeFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);
foodRouter.get("/getfood/:id", getFood);

export default foodRouter;
