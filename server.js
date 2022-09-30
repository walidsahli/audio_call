const path = require("path");
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.createReadStream(path.join(__dirname + "/index.html"))
      .pipe(res)
      .on("close", () => res.end());
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

server.listen(3000, () => {
  console.log("running");
});
