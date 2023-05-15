const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const port = process.env.PORT || 4000;

let users = [];

io.on('connection', socket => {
  socket.on('join', name => {
    const user = { id: socket.id, name };
    users.push(user);
    io.emit('users', users);
  });

  socket.on('join-room', currentRoom => {
    socket.join(currentRoom);
  });

  socket.on('message', message => {
    io.to(message.currentRoom).emit('message', message);
  });

  socket.on('disconnect', () => {
    const newUsers = users.filter(u => u.id !== socket.id);
    users = [...newUsers];
    io.emit('users', users);
  });
});

server.listen(port, () => console.log(`servidor rodando na porta ${port}`));
