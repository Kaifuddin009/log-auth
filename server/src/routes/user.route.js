import { getUserData } from "../controllers/user.controller.js";
import authMiddleware from '../middlewares/userAuth.middleware.js';
import {Router} from 'express';

const userRouter = Router();

userRouter.get('/data', authMiddleware,getUserData);
export default userRouter;