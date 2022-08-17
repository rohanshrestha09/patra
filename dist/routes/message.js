"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getMessage, addMessage } = require("../controller/message");
const auth = require("../middleware/auth");
router.use(auth);
router.post("/getmsg", getMessage);
router.post("/addmsg", addMessage);
module.exports = router;
