"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { register, login, getAllUsers, setAvatar, deleteUser, getSingleUser, } = require("../controller/user");
const auth = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/signup", register);
router.post("/login", login);
router.get("/users/:id", auth, getAllUsers);
router.get("/user/:id", auth, getSingleUser);
router.put("/setavatar/:id", auth, setAvatar);
router.delete("/delete/:id", auth, deleteUser);
module.exports = router;
