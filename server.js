const path = require("path");
const http = require("http");
const fs = require("fs");

const cache = {};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    if ("file" in cache) {
      res.end(cache["file"]);
      return;
    }
    const f = fs.readFileSync(path.join(__dirname + "/index.html"));
    cache["file"] = f;
    res.end(f);
  }
});
const WebSocket = require("ws");
const io = new WebSocket.Server({ server });

const subscribers = [];

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    if (data.toString() === "subscribe") {
      subscribers.push(socket);
      return;
    }
    subscribers.forEach((socket) => {
      socket.send(data);
    });
  });
});

server.keepAliveTimeout = 10 * 1000;

server.listen(8081, () => {
  console.log("running");
});
