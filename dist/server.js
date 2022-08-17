"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
const app = (0, express_1.default)();
const socket = require("socket.io");
require("dotenv").config({ path: __dirname + "/.env" });
app.use(express_1.default.urlencoded({ extended: false }));
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
app.use(express_1.default.static(path.resolve(__dirname, "..", "client/build")));
const PORT = process.env.PORT || 5000;
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
connectDB();
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/message"));
app.use("/api", require("./routes/protected"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client/build", "index.html"));
});
app.set("port", PORT);
const server = app.listen(PORT);
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
io.on("connection", (socket) => {
    socket.on("send-message", (data) => {
        io.emit("receive-message", data);
    });
});
