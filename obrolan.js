const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

// Hosting file statis
app.use(express.static('public'));

// Event saat user terhubung
io.on('connection', (socket) => {
  let username = `User-${Math.floor(Math.random() * 1000)}`;
  users.push(username);

  io.emit('updateUserList', users); // Update daftar user

  console.log(`${username} connected`);

  // Menerima pesan dari klien
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', { username, message }); // Kirim ke semua user
  });

  // Event saat user terputus
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== username);
    io.emit('updateUserList', users);
    console.log(`${username} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
