import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import donorRouter from './routes/donor.js';
import hospitalRouter from './routes/hospital.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DB Connected Successfully'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
    });

// Ensure upload directories exist
const uploadBaseDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadBaseDir)) {
    fs.mkdirSync(uploadBaseDir, { recursive: true });
}


app.use('/api', hospitalRouter, donorRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});