import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login...');
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password
            });

            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            console.log('Updating authentication state...');
            onLogin();
            
            console.log('Redirecting to home page...');
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'An error occurred during login');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper 
                elevation={6} 
                sx={{ 
                    p: 4,
                    background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
                    borderRadius: 3,
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom 
                    align="center"
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#1976d2',
                        mb: 4,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ mb: 2 }}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 3 }}
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
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
                        Login
                    </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Don't have an account?{' '}
                        <Link 
                            to="/register" 
                            style={{ 
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                color: '#1976d2',
                            }}
                            sx={{ 
                                transition: 'color 0.3s ease',
                                '&:hover': {
                                    color: '#1565c0',
                                }
                            }}
                        >
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login; 