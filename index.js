import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/user.routes.js';

dotenv.config();

connectDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api/v1/auth',authRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});