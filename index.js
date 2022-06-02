const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

const users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send-message", (message) => {
    socket.broadcast.emit("receive-message", {
      name: users[socket.id],
      message,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-left", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
  console.log("server is up and running on port 3000...");
});
