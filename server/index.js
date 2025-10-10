import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import donorRouter from './routes/donor.js';
import userRouter from './routes/user.js';
import hospitalRouter from './routes/hospital.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DB Connected Successfully'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
    });

app.use('/api', hospitalRouter, donorRouter, userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});