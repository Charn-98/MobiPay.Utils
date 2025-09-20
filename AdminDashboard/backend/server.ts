import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import type { Application } from 'express';
import express from 'express';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

connectDatabase();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API running!');
});

app.listen(port, () => console.log(`Server running port ${port}`));