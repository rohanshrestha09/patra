"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("socket.io");
require("dotenv").config({ path: __dirname + "/.env" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.static(path.resolve(__dirname, "..", "client/build")));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
mongoose_1.default.connect(process.env.MONGODB_URI);
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/message"));
app.use("/api", require("./routes/auth"));
const server = app.listen(PORT);
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
global.authUser = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add", (user) => {
        global.authUser.set(user, socket.id);
    });
    socket.on("send-message", ({ to, msg }) => {
        const user = global.authUser.get(to);
        if (user)
            io.to(user).emit("receive-message", msg);
    });
});
