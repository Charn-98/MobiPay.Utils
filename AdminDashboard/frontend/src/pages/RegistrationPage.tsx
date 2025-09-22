import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const RegistrationPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //TODO: in real-world this url would be in env variables as well
      const response = await axios.post('http://localhost:5000/auth/admin/register', { email, password, role: 'super_admin' });
      setMessage(response.data.message);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                setMessage((axiosError.response.data as { message: string }).message || 'Registration failed');
            } else {
                setMessage('Network or server error occurred.');
            }
        } else {
            setMessage('An unknown error occurred.');
        }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" color="primary">
          Admin Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
        {message && <Typography color="text.secondary" sx={{ mt: 2 }}>{message}</Typography>}
        <Link to="/login">Already have an account? Login here</Link>
      </Box>
    </Container>
  );
};

export default RegistrationPage;