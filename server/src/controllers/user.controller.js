import bcrypt from "bcryptjs";

import {User} from "../models/user.model.js";

const registerUser = async(req, res)=>{
  try {
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
    await createUser.save();
  } catch (error) {
    return res.status(400).json({success:false, message:error.message})
  }
}