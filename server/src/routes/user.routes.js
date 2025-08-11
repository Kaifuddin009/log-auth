import { Router } from 'express';
import { isAuthenticated, logOut, loginIN, registerUser, resendOtp, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/userAuth.middleware.js';

const userRouter = Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginIN);
userRouter.post('/logout',logOut);
userRouter.post('/send',authMiddleware,sendVerifyOtp)
userRouter.post('/isauth',authMiddleware,isAuthenticated)
userRouter.post('/send-reset-otp',resendOtp)
userRouter.post('/reset-password',resetPassword)

export default userRouter;