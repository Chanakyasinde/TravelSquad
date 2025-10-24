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

// Chat routes
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

// Trip routes
app.get('/trips', async (req, res) => {
  try {
    const { userEmail } = req.query;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    // Get trips where user is a member
    const [trips] = await pool.query(
      `SELECT t.* 
       FROM trips t
       JOIN trip_members tm ON t.id = tm.trip_id
       WHERE tm.member_email = ?`,
      [userEmail]
    );
    
    // For each trip, get its events, expenses and members
    for (let trip of trips) {
      // Get events
      const [events] = await pool.query(
        'SELECT * FROM events WHERE trip_id = ?',
        [trip.id]
      );
      trip.events = events;
      
      // Get expenses
      const [expenses] = await pool.query(
        'SELECT * FROM expenses WHERE trip_id = ?',
        [trip.id]
      );
      trip.expenses = expenses;
      
      // Get members
      const [members] = await pool.query(
        'SELECT * FROM trip_members WHERE trip_id = ?',
        [trip.id]
      );
      trip.members = members;
    }
    
    res.json(trips);
  } catch (err) {
    console.error('Error fetching trips:', err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

app.post('/trips', async (req, res) => {
  try {
    const { name, destination, startDate, endDate, createdBy, members } = req.body;
    
    if (!name || !destination || !startDate || !endDate || !createdBy) {
      return res.status(400).json({ error: 'Missing required trip fields' });
    }
    
    // Insert trip
    const [result] = await pool.query(
      'INSERT INTO trips (name, destination, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, destination, startDate, endDate, createdBy]
    );
    
    const tripId = result.insertId;
    
    // Add members
    if (members && Array.isArray(members)) {
      for (const member of members) {
        await pool.query(
          'INSERT INTO trip_members (trip_id, member_email, member_name) VALUES (?, ?, ?)',
          [tripId, member.email, member.name]
        );
      }
    }
    
    // Return the created trip
    const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    const trip = trips[0];
    
    // Add empty arrays for events, expenses, and get members
    trip.events = [];
    trip.expenses = [];
    
    const [tripMembers] = await pool.query(
      'SELECT * FROM trip_members WHERE trip_id = ?',
      [tripId]
    );
    trip.members = tripMembers;
    
    res.status(201).json(trip);
  } catch (err) {
    console.error('Error creating trip:', err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Event routes
app.post('/trips/:tripId/events', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, description, location, startTime, endTime, createdBy } = req.body;
    
    if (!title || !startTime || !createdBy) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }
    
    // Insert event
    const [result] = await pool.query(
      'INSERT INTO events (trip_id, title, description, location, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tripId, title, description || null, location || null, startTime, endTime || null, createdBy]
    );
    
    const eventId = result.insertId;
    
    // Return the created event
    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    
    res.status(201).json(events[0]);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Expense routes
app.post('/trips/:tripId/expenses', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { description, amount, paidBy, splitBetween, createdBy } = req.body;
    
    if (!description || !amount || !paidBy || !createdBy) {
      return res.status(400).json({ error: 'Missing required expense fields' });
    }
    
    // Insert expense
    const [result] = await pool.query(
      'INSERT INTO expenses (trip_id, description, amount, paid_by, created_by) VALUES (?, ?, ?, ?, ?)',
      [tripId, description, amount, paidBy, createdBy]
    );
    
    const expenseId = result.insertId;
    
    // Add split information if provided
    if (splitBetween && Array.isArray(splitBetween)) {
      for (const split of splitBetween) {
        await pool.query(
          'INSERT INTO expense_splits (expense_id, member_email, amount) VALUES (?, ?, ?)',
          [expenseId, split.email, split.amount]
        );
      }
    }
    
    // Return the created expense
    const [expenses] = await pool.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    const expense = expenses[0];
    
    // Get split information
    const [splits] = await pool.query(
      'SELECT * FROM expense_splits WHERE expense_id = ?',
      [expenseId]
    );
    expense.splits = splits;
    
    res.status(201).json(expense);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Socket.io setup for chat
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
  console.log(`Server is running on http://localhost:${PORT}`);
});