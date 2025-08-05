import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.config.js";

const connectedtoDB = async()=>{
try {
    await mongoose.connect(MONGODB_URI)
    console.log("DB is connected")
  }
  catch (error) {
    console.log("MongoDb not Connected = ",error)
  }
}
export default connectedtoDB;