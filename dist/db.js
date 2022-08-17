"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//@ts-ignore
const MONGODB_URI = process.env.MONGODB_URI;
const connectDB = () => {
    mongoose_1.default.connect(MONGODB_URI);
};
module.exports = connectDB;
