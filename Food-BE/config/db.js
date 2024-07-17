import mongoose from "mongoose";

// mongodb+srv://quangthao:q7AtvMEKG7wqLnLa@cluster0.sspl6y6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://quangthao:q7AtvMEKG7wqLnLa@cluster0.sspl6y6.mongodb.net/foodFS?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB: ", err);
    });
};
