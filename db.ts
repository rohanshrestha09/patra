import mongoose from "mongoose";

//@ts-ignore
const MONGODB_URI: string = process.env.MONGODB_URI;

const connectDB = () => {
  mongoose.connect(MONGODB_URI);
};

module.exports = connectDB;
