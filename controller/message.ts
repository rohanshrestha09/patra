import { Request, Response } from "express";

const asyncHandler = require("express-async-handler");
const Message = require("../model/message");

module.exports.messages = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { user } = req.params;

    const { size } = req.query;

    const { _id: auth } = res.locals.user;

    try {
      const messages = await Message.find({
        users: {
          $all: [auth.toString(), user],
        },
      })
        .limit(Number(size || 20))
        .sort({ updatedAt: -1 });

      const count = await Message.countDocuments({
        users: {
          $all: [auth.toString(), user],
        },
      });

      return res.status(200).json({ data: messages, count });
    } catch (err: any) {
      return res.status(500).json(err.message);
    }
  }
);

module.exports.add = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: auth } = res.locals.user;

    const { to, message } = req.body;

    try {
      await Message.create({
        message,
        users: [auth.toString(), to],
        sender: auth,
      });

      return res.sendStatus(201);
    } catch (err: any) {
      return res.status(500).json(err.message);
    }
  }
);
