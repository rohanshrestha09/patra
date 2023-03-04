import express, { Application } from "express";
import mongoose from "mongoose";
import type { Socket } from "socket.io";

const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("socket.io");

require("dotenv").config({ path: __dirname + "/.env" });

const app: Application = express();

const PORT: any = process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "..", "client/build")));

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI as string);

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

declare namespace NodeJS {
  interface Global {
    authUser: Map<string, string>;
    chatSocket: Socket;
  }
}

declare const global: NodeJS.Global & typeof globalThis;

global.authUser = new Map();

io.on("connection", (socket: any) => {
  global.chatSocket = socket;
  socket.on("add", (user: string) => {
    global.authUser.set(user, socket.id);
  });

  socket.on(
    "send-message",
    ({ to, msg }: { from: string; to: string; msg: string }) => {
      const user = global.authUser.get(to);
      if (user) io.to(user).emit("receive-message", msg);
    }
  );
});
