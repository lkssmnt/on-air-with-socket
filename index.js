const express = require('express');
const app = express();
const http = require('http');
// const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 3000;

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://lsiemoneit.de",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const userArr = [];

io.on('connection', (socket) => {
  userArr.push({
    userID: socket.id,
    xPos: 0,
    yPos: 0,
  });
  console.log(`a user with the id ${socket.id} connected. users online: ${userArr.length}`);

  socket.on('mouse move', (mousePos) => {
    socket.broadcast.emit('updateCursorPos', {session_id: socket.id, coords: mousePos});
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});