import express from 'express';
import { login, signUp } from '../control/user.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.get('/login', login);

export default userRouter;