import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import type { Application } from 'express';
import express from 'express';
import authRoutes from './routes/api/authRoutes';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

//connect to database
connectDatabase();

//run middleware
app.use(express.json());

//register routes
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('API running!');
});

app.listen(port, () => console.log(`Server running port ${port}`));