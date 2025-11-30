# TravelSquad – Group Trip Planner & Expense Manager

## Project Structure

```
TravelSquad/
├── backend/                # Express.js API
│   ├── database.sql        # Database schema
│   ├── index.js            # Main server file
│   └── package.json
├── frontend/               # React Native Expo project
│   ├── components/         # Reusable UI components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation configuration
│   └── package.json
├── idea.md                 # Project Idea and Overview
└── README.md               # Project documentation
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
