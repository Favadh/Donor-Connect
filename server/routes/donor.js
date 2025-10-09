import express from 'express';
import { appointmentNotification, createDonor, updateDatas, viewDatas } from '../control/donor.js';

const donorRouter = express.Router();

donorRouter.post('/donor/:userId', createDonor);
donorRouter.get('/viewdonordata/:userId', viewDatas);
donorRouter.put('/updatedonor/:userId', updateDatas);
donorRouter.get('/viewappnotification/:userId', appointmentNotification);

export default donorRouter;
