import { Request, Response } from 'express';
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../model/user');

module.exports.register = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { fullname, email, password, confirmpassword } = req.body;

  const emailExists = await User.findOne({ email });

  if (emailExists) return res.status(400).json('Email already exists');

  if (password.length < 6)
    return res.status(400).json('Password must contain atleast 6 characters');

  if (password !== confirmpassword) return res.status(400).json('Password does not match');

  const salt = await bcrypt.genSalt(11);
  const hashedPassword: string = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token: string = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: '30d',
    });

    return res.status(200).json({ message: 'Signup Successful', token });
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
});

module.exports.login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(400).json('User does not exists');

    const isMatched: boolean = await bcrypt.compare(password, user.password);

    if (!isMatched) return res.status(400).json('Incorrect Password');

    const token: string = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: '30d',
    });

    if (isMatched) return res.status(200).json({ message: 'Login Successful', token });
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
});

module.exports.getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { search } = req.query;

    let query = { _id: { $ne: new mongoose.Types.ObjectId(id) } };

    if (search)
      query = Object.assign(
        {
          $or: [
            { fullname: new RegExp(String(search), 'i') },
            { email: new RegExp(String(search), 'i') },
          ],
        },
        query
      );

    try {
      const allUsers = await User.find(query).select('-password').sort({ createdAt: 1 });
      return res.status(201).json(allUsers);
    } catch (err: any) {
      return res.status(400).json(err.message);
    }
  }
);

module.exports.getSingleUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
      const singleUser = await User.findById(new mongoose.Types.ObjectId(id)).select('-password');
      return res.status(201).json(singleUser);
    } catch (err: any) {
      return res.sendStatus(400).json(err.message);
    }
  }
);

module.exports.setAvatar = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { imgUrl } = req.body;
  try {
    await User.findOneAndUpdate({ _id: id }, { imgUrl });
    return res.status(201).json({ message: 'Avatar Setup Successful' });
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
});

module.exports.deleteUser = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    await User.findOneAndDelete({ _id: id });
    return res.status(201).json({ message: 'Account deletion successful' });
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
});
