import { Router } from 'express';
import { isAuthenticated, logOut, loginIN, registerUser, resendOtp, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/userAuth.middleware.js';

const authRouter = Router();

authRouter.post('/register',registerUser);
authRouter.post('/login',loginIN);
authRouter.post('/logout',logOut);
authRouter.post('/send-verify-otp',authMiddleware,sendVerifyOtp)
authRouter.post('/verify-account',authMiddleware,verifyEmail)
authRouter.get('/is-auth',authMiddleware,isAuthenticated)
authRouter.post('/send-reset-otp',resendOtp)
authRouter.post('/reset-password',resetPassword)

export default authRouter;