const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json()); 

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
const PORT = process.env.PORT || 3001;

app.get('/chat/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const [messages] = await pool.query(
      'SELECT * FROM messages WHERE trip_id = ? ORDER BY created_at DESC', 
      [tripId]
    );
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    const { roomId, ...message } = messageData;
    
    try {
      await pool.query(
        'INSERT INTO messages (trip_id, sender_email, message_text) VALUES (?, ?, ?)',
        [roomId, message.senderEmail, message.text]
      );
      
      io.to(roomId).emit('receiveMessage', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Chat server is running on http://localhost:${PORT}`);
});