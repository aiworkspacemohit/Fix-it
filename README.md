# FixIt – Reliable Repairs & Home Services Platform

FixIt is a modern, full-stack marketplace designed to connect homeowners with verified local repair experts. Whether you need a leaking pipe fixed, an AC serviced, or general home maintenance, FixIt simplifies the process with real-time tools and intelligent matching.

## 🚀 Key Features

-   **🔍 Expert Discovery**: Search and filter repair workers by category (Plumber, Electrician, etc.) and city.
-   **✨ AI Expert Matchmaker**: Describe your problem in natural language, and our AI (powered by Mistral-7B) will recommend the best 3 workers for your specific needs.
-   **💬 Real-Time Chat**: Integrated chat system using Socket.io for instant communication between customers and workers.
-   **📅 Booking System**: Seamlessly book services, manage upcoming tasks, and track service history.
-   **⭐ Reviews & Ratings**: Transparent feedback system to ensure high-quality service and trust within the community.
-   **👤 Professional Profiles**: Detailed worker profiles showcasing skills, hourly rates, and past performance.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [React](https://reactjs.org/) (built with [Vite](https://vitejs.dev/))
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React Context API
-   **Real-time Logic**: Socket.io-client

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
-   **Authentication**: JSON Web Tokens (JWT) & BcryptJS
-   **Real-time Communication**: [Socket.io](https://socket.io/)

### AI Integration
-   **Model**: Mistral-7B-Instruct-v0.1
-   **API**: HuggingFace Inference API

## 📦 Project Structure

```text
fix_it/
├── backend/            # Express server, MongoDB models, and API routes
│   ├── middleware/     # Auth and error handling
│   ├── models/         # Mongoose schemas (User, Worker, Booking, etc.)
│   ├── routes/         # API endpoints (Auth, AI, Booking, etc.)
│   └── server.js       # Main server entry point
├── frontend/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and Socket context providers
│   │   ├── pages/      # Application views (Home, Profile, Dashboard)
│   │   └── App.jsx     # Main React routes
└── README.md           # Project documentation (this file)
```

## ⚙️ Setup Instructions

### 1. Prerequisites
-   Node.js installed
-   MongoDB Atlas account or local MongoDB instance

### 2. Backend Setup
1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add the following:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    HF_API_TOKEN=your_huggingface_api_token
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup
1.  Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## 📜 License
This project is licensed under the ISC License.
