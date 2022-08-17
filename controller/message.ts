import { Request, Response } from "express";

const asyncHandler = require("express-async-handler");
const Message = require("../model/message");

module.exports.getMessage = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { from, to } = req.body;

    try {
      const messages = await Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: -1 });

      const messagesData = messages.map((element: any) => {
        return {
          self: element.sender.toString() === from.toString(),
          message: element.message,
        };
      });
      return res.status(201).json(messagesData);
    } catch (err: any) {
      return res.status(400).json(err.message);
    }
  }
);

module.exports.addMessage = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { from, to, message } = req.body;
    try {
      await Message.create({
        message: message,
        users: [from, to],
        sender: from,
      });

      return res.sendStatus(201);
    } catch (err: any) {
      return res.status(400).json(err.message);
    }
  }
);
