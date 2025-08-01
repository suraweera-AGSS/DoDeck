# DoDeck Task Manager App

DoDeck is a full-stack task management application designed to help users organize their daily tasks efficiently. Built with the MERN (MongoDB, Express.js, React, Node.js) stack, it features a robust JWT-based authentication system, allowing users to register, log in, and manage their personal tasks securely.

## Features

-   **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
-   **Protected Routes**: Access to task management features is restricted to authenticated users.
-   **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
-   **Password Hashing**: User passwords are securely stored using bcrypt.
-   **Input Validation**: Robust validation on both frontend and backend to ensure data integrity.
-   **Responsive Design**: A clean and intuitive user interface.

## Technologies Used

**Frontend**:
-   React.js
-   React Router DOM
-   Axios
-   React Icons
-   Tailwind CSS (or similar for styling)

**Backend**:
-   Node.js
-   Express.js
-   MongoDB (via Mongoose)
-   bcryptjs (for password hashing)
-   jsonwebtoken (for JWT authentication)
-   dotenv (for environment variables)

## Prerequisites

Before you begin, ensure you have met the following requirements:
-   Node.js (LTS version recommended)
-   npm (Node Package Manager)
-   MongoDB Atlas account or a local MongoDB instance

## Installation

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone <repository_url>
cd DoDeck-Task-Manager-App
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and set up environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
```

-   `PORT`: The port your backend server will run on (e.g., `5000`).
-   `MONGO_URI`: Your MongoDB connection string. If using MongoDB Atlas, get this from your cluster.
-   `JWT_SECRET`: A strong, random string used to sign your JWTs. You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### 3. Frontend Setup

Navigate to the `frontend` directory and install dependencies.

```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory:

```bash
npm start
```

The backend server will run on `http://localhost:5000` (or the `PORT` you specified).

### 2. Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend application will open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

**Authentication**:
-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in an existing user and receive a JWT.
-   `GET /api/auth/me`: Get the currently authenticated user's details (requires JWT).

**Tasks**:
-   `GET /api/tasks`: Get all tasks for the authenticated user.
-   `POST /api/tasks`: Create a new task.
-   `GET /api/tasks/:id`: Get a single task by ID.
-   `PUT /api/tasks/:id`: Update a task by ID.
-   `DELETE /api/tasks/:id`: Delete a task by ID.

## Frontend Routes

-   `/`: Redirects to `/login` if not authenticated, otherwise to `/dashboard`.
-   `/login`: User login page.
-   `/register`: User registration page.
-   `/dashboard`: Protected route for authenticated users to manage tasks.

## Security Considerations

-   **Password Hashing**: Passwords are hashed using bcrypt before being stored in the database.
-   **JWT Authentication**: JSON Web Tokens are used for secure communication and session management.
-   **Environment Variables**: Sensitive information like `MONGO_URI` and `JWT_SECRET` are stored in `.env` files and are not committed to version control.

