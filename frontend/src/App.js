import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!(token && user));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <TodoList onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
