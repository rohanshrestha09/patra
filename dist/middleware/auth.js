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
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
module.exports = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [_, token] = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer"))
        ? req.headers.authorization.split(" ")
        : [];
    if (!token)
        return res.status(401).json("Not authorised");
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = yield User.findById(decoded.id).select("-password");
        if (!user)
            return res.status(404).json("Not found");
        res.locals.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json("Unauthorized");
    }
}));
