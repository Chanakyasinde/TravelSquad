DROP TABLE IF EXISTS expense_splits;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS trip_members;
DROP TABLE IF EXISTS trips;

CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date VARCHAR(50) NOT NULL,
  end_date VARCHAR(50) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trip_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  member_email VARCHAR(255) NOT NULL,
  member_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  UNIQUE KEY unique_trip_member (trip_id, member_email)
);

CREATE TABLE messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  sender_email VARCHAR(255) NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_time VARCHAR(50) NOT NULL,
  end_time VARCHAR(50),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid_by VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE expense_splits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  member_email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

CREATE INDEX idx_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_id_messages ON messages(trip_id);
CREATE INDEX idx_trip_id_events ON events(trip_id);
CREATE INDEX idx_trip_id_expenses ON expenses(trip_id);
CREATE INDEX idx_expense_id ON expense_splits(expense_id);
