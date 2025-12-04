import express from 'express';
import { createDonor } from '../control/donor.js';

const donorRouter = express.Router();

donorRouter.post('/donorRegister', createDonor);

export default donorRouter;
