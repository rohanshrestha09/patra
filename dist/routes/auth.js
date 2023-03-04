"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { authHandler } = require("../controller/auth");
const auth = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth);
router.get("/auth", authHandler);
module.exports = router;
