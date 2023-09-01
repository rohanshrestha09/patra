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
const Message = require("../model/message");
module.exports.messages = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.params;
    const { size } = req.query;
    const { _id: auth } = res.locals.user;
    try {
        const messages = yield Message.find({
            users: {
                $all: [auth.toString(), user],
            },
        })
            .limit(Number(size || 20))
            .sort({ updatedAt: -1 });
        const count = yield Message.countDocuments({
            users: {
                $all: [auth.toString(), user],
            },
        });
        return res.status(200).json({ data: messages, count });
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}));
module.exports.add = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: auth } = res.locals.user;
    const { to, message } = req.body;
    try {
        yield Message.create({
            message,
            users: [auth.toString(), to],
            sender: auth,
        });
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(500).json(err.message);
    }
}));
