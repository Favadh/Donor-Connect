import express from 'express';
import { login, signUp } from '../control/user.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

export default userRouter;