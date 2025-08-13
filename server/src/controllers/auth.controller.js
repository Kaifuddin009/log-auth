import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { JWT_SECRET_KEY,expiresIn,NODE_ENV, SENDER_EMAIL } from "../config/env.config.js";
import transporter from "../config/nodemailer.config.js";


const registerUser = async(req, res)=>{
  try { 
    console.log("Register endpoint hit. Body:", req.body);

    const {name, email, password} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({success:false, message:"Missing Detalis"})
    }
    const existingUser = await User.findOne({email});
    if (existingUser) {
       return res.status(400).json({success:false, message:"User exits with this emailID"})
    }

    const hashedPasword = await bcrypt.hash(password, 10);

    const createUser = await User.create({name, email, password:hashedPasword})
    //await createUser.save();

    const token = jwt.sign({id: createUser._id},JWT_SECRET_KEY,{expiresIn})
    res.cookie('token', token, {
      httpOnly:true,
      secure:NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    //Sending Welcome Email 

    const mailOptions = {
     from:  SENDER_EMAIL,
     to: email,
     subject: 'Welcome to the Blog-eng',
     text: `Welcome to the Blog-eng website. Your account has been created with email id ${email}`
    }
try {
  
      await transporter.sendMail(mailOptions)
      console.log('Welcome email sent');
} catch (emailError) {
  console.error('Failed to send email:', emailError);
}

    return res.status(200).json({success:true,token})

  } catch (error) {
    return res.status(400).json({success:false, message:error.message});
  }
}

const loginIN = async(req, res)=>{
try {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(404).json({success:false, message:"Missng Details"})
  }
  const user = await User.findOne({email});
  if (!email) {
    return res.status(400).json({success:false, message:"Inavalid email"})
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({success:false, message:"Invalid Password"})
  }
  const token = jwt.sign({id: user._id},JWT_SECRET_KEY,{expiresIn})
    res.cookie('token', token, {
      httpOnly:true,
      secure:NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
return res.status(200).json({success:true, message:'logIn successufully'});

} catch (error) {
  return res.status(400).json({success:false, message:error.message});
}
}

const logOut = async(req, res)=>{
try {
  res.clearCookie('token', {
    httpOnly:true,
    secure:NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return res.status(200).json({success:true, message:'Logget Out'})
} catch (error) {
  return res.status(400).json({success:false, message:error.message})
}
}

//Send Vrification OTP to the User's email
const sendVerifyOtp =async(req, res)=>{
try {
  const userId = req.userId;
  //console.log('Received userId:', userId);
  const user = await User.findById(userId)
  if (user.isAccountVerified) {
    return res.status(200).json({success:false, message:'Account Already Verified'})
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otp;
  user.verifyOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000;
  await user.save();

  const mailOptions = {
     from:  SENDER_EMAIL,
     to: user.email,
     subject: 'Account Verification Otp',
     text: `Your otp is ${otp} Verify Your Account using this OTP.`
    }
     await transporter.sendMail(mailOptions);
    return res.status(200).json({success:true, message:'Verification Opt is send on Email'})

} catch (error) {
  return res.status(400).json({success:false, message:error.message})
}
}

const verifyEmail = async(req, res)=>{
  try {
    const userId = req.userId;
    const {otp} =req.body;
    if (!(userId && otp)) {
      return res.status(400).json({success:false, message:'Missing Details'})
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({success:false, message:'User not Found'})
    }
    if (user.isAccountVerified) {
  return res.status(200).json({ success: true, message: 'Account already verified' });
}

    if (user.verifyOtp === '' || user.verifyOtp !== otp ) {
      return res.status(400).json({success:false, message:'Invalid Otp'})
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({success:false, message: 'OTP Expired'})
    }
    user.isAccountVerified = true;
    user.verifyOtp ='';
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.status(200).json({success:true, message:'Email verfiaction successfully'})

  } catch (error) {
    return res.status(400).json({success:false,message:error.message})
  }
}
//Cjheck the user is Aunthenticated or not 
const isAuthenticated = async(req, res)=>{
  try {
    return res.status(200).json({success:true, message:'User is Aunthenticated'})
  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}

const resendOtp = async(req, res)=>{
  const {email} = req.body;
  if (!email) {
    return res. status(404).json({success:false, message:'Email is Required'})
  }
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({success:false, message:'User Not found'})
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 1 * 60* 60 *1000;
    await user.save();

    const mailOptions={
      from:SENDER_EMAIL,
      to:user.email,
      subject:'Password reset OTP',
      text:`Your otp is ${otp} Reset your password with this OTP`
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json({success:true, message:'Successfully OTP send to your email'})

  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}

//Reset User Password 
const resetPassword =async(req, res)=>{
  try {
    const {email, otp, newPassword} = req.body;
    if (!(email && otp && newPassword)) {
      return res.status(404).json({success:false, message:'Email otp and new Password are required'})
    }
    const user = await User.findOne({email})
    if (!user) {
      return res.status(404).json({success:false, message:'User not Found with this Email'})
    }
    if (user.resetOtp === '' || user.resetOtp !== otp ) {
      return res.status(400).json({success:false, message:'Invalid Otp'})
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({success:false, message:'OTP Expired'})
    }
    const hashedPasword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPasword,
    user.resetOtp = '',
    user.resetOtpExpireAt =0;
    await user.save();
    return res.status(200).json({success:true, message:'Password has been reset Successfully'})

  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}
export {registerUser,loginIN,logOut,sendVerifyOtp,verifyEmail, isAuthenticated, resendOtp,resetPassword};