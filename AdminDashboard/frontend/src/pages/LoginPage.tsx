import React, { useState,  } from 'react';
import axios, { AxiosError } from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //TODO: in real-world this url would be in env variables as well
      const response = await axios.post('http://localhost:5000/auth/admin/login', { email, password });

      if(response.status == 202){
          localStorage.setItem('tempToken', response.data.tempToken);
          navigate(`/totp-setup?id=${response.data.id}`);
      } else if(response.status == 200) {
          localStorage.setItem('token', response.data.token);
          setTimeout(() => {
              navigate('/dashboard');
          }, 1000);
      }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const data = axiosError.response?.data as { message: string, id: string };

            if (axiosError.response?.status == 401 && data.message == 'MFA required') {
              navigate(`/verify-totp?id=${data.id}`);
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
          Admin Login
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
        <Link to="/register">Don't have an account? Register here</Link>
        <Box sx={{ mt: 1 }}>
          <Link to="/forgot-password">
            Forgot password?
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;