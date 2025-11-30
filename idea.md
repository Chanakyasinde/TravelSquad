
#  TravelSquad – Group Trip Planner & Expense Manager

### Chanakya Sinde – 2024-B-12112005

---

##  Project Overview

**TravelSquad** is a mobile-first fullstack application designed to simplify group travel planning. It allows users to create trips, build shared itineraries, split expenses and get real-time updates — all in one app. Perfect for friends, family, or roommates planning vacations or weekend getaways.

---

## Problem Statement

Group trips are often disorganized. Plans are shared across WhatsApp, Google Docs, and spreadsheets, while tracking shared expenses is a manual and error-prone process. Users need a centralized, mobile-first solution to coordinate travel efficiently.

---

## Proposed Solution

TravelSquad streamlines trip planning by offering collaborative features in one platform:
- Build a shared itinerary
- Split and track expenses
- Get reminders and notifications

---

## Key Features

-  **Create Trips** – Create new trips 
-  **Itinerary Builder** – Add events with date, time, and location  
-  **Expense Tracker** – Split expenses evenly or custom, with debt tracking  
-  **Trip Summary** – Overview of total expenses, activities, and members

---

## Target Audience

- College students  
- Travelers in groups  
- Families planning vacations  
- Event or weekend trip organizers  

---

##  Tech Stack

| Layer         | Tools & Libraries                          |
|---------------|---------------------------------------------|
| **Frontend**  | React Native (Expo)                         |
| **Backend**   | Node.js + Express                           |
| **Database**  | MySQL                                       |
| **Auth**      | Firebase Auth                               |

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js installed
- MySQL installed and running
- Expo Go app installed on your mobile device (or use an emulator)

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
    - Import the schema from `database.sql` 
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    The server should run on `http://localhost:3001`.

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
    npx expo start
    ```
5.  Scan the QR code with the Expo Go app or press `a` for Android emulator / `i` for iOS simulator.

---
