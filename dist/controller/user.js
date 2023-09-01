"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const Message = require("../model/message");
module.exports.register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, confirmpassword } = req.body;
    const emailExists = yield User.findOne({ email });
    if (emailExists)
        return res.status(400).json("Email already exists");
    if (password.length < 6)
        return res.status(400).json("Password must contain atleast 6 characters");
    if (password !== confirmpassword)
        return res.status(400).json("Password does not match");
    const salt = yield bcrypt.genSalt(11);
    const hashedPassword = yield bcrypt.hash(password, salt);
    try {
        const user = yield User.create({
            fullname,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "30d",
        });
        return res.status(200).json({ message: "Signup Successful", token });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
module.exports.login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email }).select("+password");
        if (!user)
            return res.status(400).json("User does not exists");
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(400).json("Incorrect Password");
        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "30d",
        });
        if (isMatched)
            return res.status(201).json({ message: "Login Successful", token });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
}));
module.exports.users = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: auth } = res.locals.user;
    const { search, size } = req.query;
    let query = { _id: { $ne: new mongoose_1.default.Types.ObjectId(auth) } };
    if (search)
        query = Object.assign({
            $or: [
                { fullname: new RegExp(String(search), "i") },
                { email: new RegExp(String(search), "i") },
            ],
        }, query);
    try {
        const users = yield User.find(query)
            .select("-password")
            .limit(Number(size || 20))
            .sort({ createdAt: 1 });
        const count = yield User.countDocuments({});
        return res.status(200).json({ data: users, count });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}));
module.exports.user = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.params;
    try {
        const singleUser = yield User.findById(new mongoose_1.default.Types.ObjectId(user)).select("-password");
        return res.status(200).json(singleUser);
    }
    catch (err) {
        return res.sendStatus(500).json(err.message);
    }
}));
module.exports.setAvatar = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: auth } = res.locals.user;
    const { imgUrl } = req.body;
    try {
        yield User.findOneAndUpdate({ _id: auth }, { imgUrl });
        return res.status(201).json({ message: "Avatar Setup Successful" });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}));
module.exports.deleteUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: auth } = res.locals.user;
    try {
        yield User.findOneAndDelete({ _id: auth });
        yield Message.deleteMany({ user: [auth] });
        return res.status(201).json({ message: "Account deletion successful" });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}));
