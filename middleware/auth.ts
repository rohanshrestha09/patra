import { Request, Response, NextFunction } from 'express';
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const [_, token] = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')
      : [];

    if (!token) return res.status(400).json('Not authorised');

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await User.findById(decoded.id).select('-password');

      if (!user) return res.status(404).json('Not found');

      res.locals.user = user;

      next();
    } catch (err) {
      return res.status(401).json('Unauthorized');
    }
  }
);
