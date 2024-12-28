const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Auth routes
app.use('/api/auth', authRoutes);

// Todo schema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get todos
app.get('/api/todos', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new todo
app.post('/api/todos', verifyToken, async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text,
            user: req.userId
        });
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update todo
app.put('/api/todos/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (req.body.text != null) {
            todo.text = req.body.text;
        }
        if (req.body.completed != null) {
            todo.completed = req.body.completed;
        }
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete todo
app.delete('/api/todos/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 