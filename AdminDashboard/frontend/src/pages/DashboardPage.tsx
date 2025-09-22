import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';

const dummyData = [
  { name: 'Jan', transactions: 4000 },
  { name: 'Feb', transactions: 3000 },
  { name: 'Mar', transactions: 2000 },
  { name: 'Apr', transactions: 2780 },
  { name: 'May', transactions: 1890 },
];

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<{email: string, role: string}>();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUserProfile();
  }, [navigate]);


  return (
    <Container sx={{width:'100%'}}>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom color="primary">
          Admin Dashboard
        </Typography>
        {user &&
          <Box>
            <Typography variant="body1" color="gray">
              Welcome to the admin dashboard, {user.email}!
            </Typography>
            <Typography>
              Roles: {user.role}
            </Typography>
          </Box>
        }

        <Box sx={{ my: 4, width:'100%'}}>
          <Typography variant="h6">Monthly Transaction Overview</Typography>
          <ResponsiveContainer width={1200} height={300}>
            <LineChart data={dummyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Transactions" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;