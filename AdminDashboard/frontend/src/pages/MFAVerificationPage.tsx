import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const MFAVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const id = searchParams.get('id');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
        setMessage('Invalid request');
        return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/mfa-verify', { id, token });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      setMessage(error.response?.data.message || 'Invalid token. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" color="primary">
          Verify 2FA
        </Typography>
        <Typography sx={{ mt: 2 }} color="gray">
          Please enter the 6-digit code from your authenticator app.
        </Typography>
        <Box component="form" onSubmit={handleVerify} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="2FA Code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Verify
          </Button>
        </Box>
        {message && <Typography color="error" sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default MFAVerificationPage;