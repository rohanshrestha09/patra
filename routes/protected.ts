import express, { Request, Response, Router } from "express";
const router: Router = express.Router();
const asyncHandler = require("express-async-handler");
const auth = require("../middleware/auth");

router.use(auth);

router.get(
  "/protected",
  asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json(res.locals.user);
  })
);

module.exports = router;
