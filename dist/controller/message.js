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
module.exports.getMessage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.body;
    try {
        const messages = yield Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: -1 });
        const messagesData = messages.map((element) => {
            return {
                self: element.sender.toString() === from.toString(),
                message: element.message,
            };
        });
        return res.status(201).json(messagesData);
    }
    catch (err) {
        return res.status(400).json(err.message);
    }
}));
module.exports.addMessage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, message } = req.body;
    try {
        yield Message.create({
            message: message,
            users: [from, to],
            sender: from,
        });
        return res.sendStatus(201);
    }
    catch (err) {
        return res.status(400).json(err.message);
    }
}));
