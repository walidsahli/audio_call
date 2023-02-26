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

  if (req.url === "/test_api") {
    res.write(JSON.stringify({ hello: "world" }));
    res.end();
    return;
  }
});

server.keepAliveTimeout = 10 * 1000;

server.listen(8081, () => {
  console.log("running");
});
