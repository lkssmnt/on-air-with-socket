const express = require('express');
const app = express();
const http = require('http');
// const server = http.createServer(app);
const { Server } = require("socket.io");

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://example.com",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});