import express from 'express';
import { appointDonor, createHospital, updateHospital, viewHospital } from '../control/hospital.js';

const hospitalRouter = express.Router();

hospitalRouter.post('/createHospital/:userId', createHospital);
hospitalRouter.get('/viewHospital/:userId', viewHospital);
hospitalRouter.put('/updateHospital/:userId', updateHospital);
hospitalRouter.get('/notifyAppoinment/:donorId/:hospitalId', appointDonor);

export default hospitalRouter;