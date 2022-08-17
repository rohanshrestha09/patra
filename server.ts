import express, { Application } from "express";
const path = require("path");
const app: Application = express();
const socket = require("socket.io");
require("dotenv").config({ path: __dirname + "/.env" });

app.use(express.urlencoded({ extended: false }));
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
app.use(express.static(path.resolve(__dirname, "..", "client/build")));

const PORT: any = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: false }));
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

io.on("connection", (socket: any) => {
  socket.on(
    "send-message",
    (data: { from: string; to: string; msg: string }) => {
      io.emit("receive-message", data);
    }
  );
});
