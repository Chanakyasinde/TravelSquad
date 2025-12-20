# TravelSquad – Group Trip Planner & Expense Manager

<p align="center">
  <a href="https://drive.google.com/file/d/1MEKO_N2iFQvjRU6UcvQLiSOYN8rZKhqo/view?usp=sharing"><b>Watch Demo Video</b></a>
</p>

##  Project Overview

**TravelSquad** is a mobile-first fullstack application designed to simplify group travel planning. It allows users to create trips, build shared itineraries, split expenses and get real-time updates — all in one app. Perfect for friends, family, or roommates planning vacations or weekend getaways.

---

## Key Features

-  **Create Trips** – Create new trips 
-  **Itinerary Builder** – Add events with date, time, and location  
-  **Expense Tracker** – Split expenses evenly or custom, with debt tracking  
-  **Trip Summary** – Overview of total expenses, activities, and members

---

##  Tech Stack

| Layer         | Tools & Libraries                          |
|---------------|---------------------------------------------|
| **Frontend**  | React Native (Expo)                         |
| **Backend**   | Node.js + Express                           |
| **Database**  | MySQL                                       |
| **Auth**      | Firebase Auth                               |

---

## Project Structure

```
TravelSquad/
├── backend/                
│   ├── database.sql        
│   ├── index.js           
│   └── package.json
├── frontend/               
│   ├── components/         
│   ├── screens/            
│   ├── navigation/         
│   └── package.json
├── idea.md                 
└── README.md              
```

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) installed and running
- [Expo Go](https://expo.dev/client) app on your mobile device (or an emulator)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Create a `.env` file in the `backend` directory.
    - Copy the contents from `.env.example` and update the values (especially database credentials).

4.  Set up the database:
    - Create a MySQL database named `travelsquad`.
    - Import the schema from `database.sql`.

5.  Start the server:
    ```bash
    npm run dev
    ```
    The server should be running on `http://localhost:3001`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    - Create a `.env` file in the `frontend` directory.
    - Copy the contents from `.env.example` and update the values (Firebase config and API URL).
    - **Note**: Ensure `API_URL` points to your backend's IP address (e.g., `http://192.168.1.5:3001`) if testing on a physical device, as `localhost` will not work from the phone.

4.  Start the Expo development server:
    ```bash
    npm start
    ```

5.  Run on device/emulator:
    - **Physical Device**: Scan the QR code with the Expo Go app.
    - **Emulator**: Press `a` for Android or `i` for iOS (macOS only).

---

## License

This project is for educational purposes.
