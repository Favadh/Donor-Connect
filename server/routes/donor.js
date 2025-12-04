import express from 'express';
import { createDonor } from '../control/donor.js';

const donorRouter = express.Router();

donorRouter.post('/donor/:userId', createDonor);

export default donorRouter;
