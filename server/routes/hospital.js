import express from 'express';
import { appointDonor, createHospital, login, signUp, viewDonors } from '../control/hospital.js';
import auth from '../middleware/auth.js';

const hospitalRouter = express.Router();

hospitalRouter.post('/login', login);
hospitalRouter.post('/signup', signUp);
hospitalRouter.post('/createHospital', auth, createHospital);
hospitalRouter.get('/viewDonors', auth, viewDonors);
hospitalRouter.get('/appointDonor/:donorId', auth, appointDonor);

export default hospitalRouter;