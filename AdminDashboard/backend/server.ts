import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import type { Application } from 'express';
import express from 'express';
import authRoutes from './routes/api/authRoutes';
import dashboardRoutes from './routes/api/dashboardRoutes';
import cors from 'cors';
// import mongoSanitize from 'express-mongo-sanitize';
import { authLimiter } from './middleware/rateLimiter';
import { enforceHttps } from './middleware/https';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

//connect to database
connectDatabase();

if (process.env.NODE_ENV === 'production') {
  app.use(enforceHttps); //dont' suse locally for testing.
}

//run middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(mongoSanitize());
app.use(cors());

//register routes
app.use('auth/admin', authLimiter); //rate limiting
app.use('/auth/admin', authRoutes);
app.use('/api/admin', dashboardRoutes);
app.get('/', (req, res) => {
    res.send('API running!');
});

app.listen(port, () => console.log(`Server running port ${port}`));