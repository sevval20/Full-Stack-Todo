import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Paper,
    Typography,
    Box,
    Fade,
    Grow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

function TodoList({ onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState('');
    const navigate = useNavigate();

    const fetchTodos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/todos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTodos(response.data);
        } catch (error) {
            console.error('Error loading todos:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    }, [navigate]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/todos`, 
                { text: newTodo },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewTodo('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleToggle = async (todo) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/todos/${todo._id}`,
                { completed: !todo.completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const startEditing = (todo) => {
        setEditingTodo(todo._id);
        setEditText(todo.text);
    };

    const handleEdit = async () => {
        if (!editText.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/todos/${editingTodo}`,
                { text: editText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingTodo(null);
            setEditText('');
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate('/login', { replace: true });
    };

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Fade in timeout={1000}>
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4,
                        background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold',
                                color: '#1976d2',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            Todo List
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>

                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            mb: 4,
                            color: '#666',
                            fontStyle: 'italic'
                        }}
                    >
                        Welcome, {user?.username}!
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Add new todo"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!newTodo.trim()}
                            startIcon={<AddTaskIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            Add
                        </Button>
                    </Box>

                    <List>
                        {todos.map((todo, index) => (
                            <Grow
                                in
                                timeout={300 * (index + 1)}
                                key={todo._id}
                            >
                                <ListItem
                                    sx={{
                                        mb: 2,
                                        bgcolor: todo.completed ? '#e8f5e9' : '#fff',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateX(5px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        },
                                    }}
                                >
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => handleToggle(todo)}
                                        color="primary"
                                        sx={{
                                            '&:hover': { transform: 'scale(1.1)' },
                                            transition: 'transform 0.2s',
                                        }}
                                    />
                                    {editingTodo === todo._id ? (
                                        <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                            <TextField
                                                fullWidth
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                size="small"
                                                autoFocus
                                            />
                                            <Button 
                                                onClick={handleEdit} 
                                                variant="contained" 
                                                size="small"
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    },
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            <ListItemText
                                                primary={todo.text}
                                                sx={{
                                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                                    color: todo.completed ? '#4caf50' : 'inherit',
                                                    transition: 'all 0.3s ease',
                                                }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="edit"
                                                    onClick={() => startEditing(todo)}
                                                    sx={{
                                                        mr: 1,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            color: '#1976d2',
                                                            transform: 'rotate(15deg)',
                                                        },
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(todo._id)}
                                                    sx={{
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            color: '#f44336',
                                                            transform: 'rotate(-15deg)',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </>
                                    )}
                                </ListItem>
                            </Grow>
                        ))}
                    </List>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{
                            mt: 4,
                            color: '#666',
                            fontStyle: 'italic',
                            opacity: 0.8,
                            transition: 'opacity 0.3s ease',
                            '&:hover': {
                                opacity: 1,
                            },
                        }}
                    >
                        Created by Sevval ❤️
                    </Typography>
                </Paper>
            </Fade>
        </Container>
    );
}

export default TodoList; 