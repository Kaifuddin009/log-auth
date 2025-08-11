import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config/env.config.js';
const authMiddleware =(req, res, next)=>{
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({success:false, message:'Not Authorized Login again'})
    }
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY );
    if (decodedToken.id) {
      req.userId = decodedToken.id;
    } else {
      return res.status(400).json({success:false, message:'Not Authorized Login Again'})
    }
    next();

  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}
export default authMiddleware;