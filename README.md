# Full Stack Todo Application

A modern, full-stack todo application built with React and Node.js, featuring user authentication and a clean, animated UI.

## Features

- **User Authentication**
  - Register with username, email, and password
  - Login with username and password
  - JWT-based authentication
  - Protected routes

- **Todo Management**
  - Create new todos
  - Mark todos as completed
  - Edit existing todos
  - Delete todos
  - User-specific todos

- **Modern UI/UX**
  - Material-UI components
  - Smooth animations and transitions
  - Responsive design
  - Hover effects
  - Loading animations
  - Error handling with user feedback

## Technologies Used

### Frontend
- React.js
- Material-UI (MUI)
- React Router DOM
- Axios
- JWT for authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- CORS

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- Git

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-project.git
cd todo-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/todoapp
JWT_SECRET=your-secret-key
```

## Running the Application

1. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo service mongod start
```

2. Start the backend server
```bash
cd backend
npm start
```

3. Start the frontend application (in a new terminal)
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user info

### Todos
- GET `/api/todos` - Get all todos for current user
- POST `/api/todos` - Create a new todo
- PUT `/api/todos/:id` - Update a todo
- DELETE `/api/todos/:id` - Delete a todo

## Project Structure

```
todo-project/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   └── auth.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── TodoList.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   └── Register.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created by Sevval
- Built with React and Node.js
- Styled with Material-UI 