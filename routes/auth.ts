import { Router } from "express";

const { authHandler } = require("../controller/auth");

const auth = require("../middleware/auth");

const router = Router();

router.use(auth);

router.get("/auth", authHandler);

module.exports = router;
