const express = require('express');

const cors = require('cors');
const pool = require('./db'); 

const app = express();
app.use(cors());
app.use(express.json()); 


const PORT = process.env.PORT || 3001;


app.get('/trips', async (req, res) => {
  try {
    const { userEmail } = req.query;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    

    const [trips] = await pool.query(
      `SELECT t.* 
       FROM trips t
       JOIN trip_members tm ON t.id = tm.trip_id
       WHERE tm.member_email = ?`,
      [userEmail]
    );
    

    for (let trip of trips) {

      const [events] = await pool.query(
        'SELECT * FROM events WHERE trip_id = ?',
        [trip.id]
      );
      trip.events = events;
      

      const [expenses] = await pool.query(
        'SELECT * FROM expenses WHERE trip_id = ?',
        [trip.id]
      );
      trip.expenses = expenses;
      

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
    

    const [result] = await pool.query(
      'INSERT INTO trips (name, destination, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?)',
      [name, destination, startDate, endDate, createdBy]
    );
    
    const tripId = result.insertId;
    
  
    if (members && Array.isArray(members)) {
      for (const member of members) {
        await pool.query(
          'INSERT INTO trip_members (trip_id, member_email, member_name) VALUES (?, ?, ?)',
          [tripId, member.email, member.name]
        );
      }
    }
    

    const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    const trip = trips[0];
    

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


app.post('/trips/:tripId/events', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { title, description, location, startTime, endTime, createdBy } = req.body;
    
    if (!title || !startTime || !createdBy) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }
    

    const [result] = await pool.query(
      'INSERT INTO events (trip_id, title, description, location, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tripId, title, description || null, location || null, startTime, endTime || null, createdBy]
    );
    
    const eventId = result.insertId;
    

    const [events] = await pool.query('SELECT * FROM events WHERE id = ?', [eventId]);
    
    res.status(201).json(events[0]);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});


app.post('/trips/:tripId/expenses', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { description, amount, paidBy, splitBetween, createdBy } = req.body;
    
    if (!description || !amount || !paidBy || !createdBy) {
      return res.status(400).json({ error: 'Missing required expense fields' });
    }
    

    const [result] = await pool.query(
      'INSERT INTO expenses (trip_id, description, amount, paid_by, created_by) VALUES (?, ?, ?, ?, ?)',
      [tripId, description, amount, paidBy, createdBy]
    );
    
    const expenseId = result.insertId;
    
    
    if (splitBetween && Array.isArray(splitBetween)) {
      for (const split of splitBetween) {
        await pool.query(
          'INSERT INTO expense_splits (expense_id, member_email, amount) VALUES (?, ?, ?)',
          [expenseId, split.email, split.amount]
        );
      }
    }
    

    const [expenses] = await pool.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    const expense = expenses[0];
    

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


app.post('/trips/:tripId/members', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing member email or name' });
    }

    try {
      await pool.query(
        'INSERT INTO trip_members (trip_id, member_email, member_name) VALUES (?, ?, ?)',
        [tripId, email, name]
      );
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
 
        const [rows] = await pool.query(
          'SELECT * FROM trip_members WHERE trip_id = ? AND member_email = ?',
          [tripId, email]
        );
        return res.status(200).json(rows[0]);
      }
      throw err;
    }

    const [rows] = await pool.query(
      'SELECT * FROM trip_members WHERE trip_id = ? AND member_email = ?',
      [tripId, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});


app.delete('/trips/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    await pool.query('DELETE FROM trips WHERE id = ?', [tripId]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
