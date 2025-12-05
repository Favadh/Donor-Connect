import express from 'express';
import { createDonor } from '../control/donor.js';
import upload from '../middleware/upload.js';

const donorRouter = express.Router();

donorRouter.post('/donorRegister', upload.single('profilePhoto'), createDonor);

export default donorRouter;
