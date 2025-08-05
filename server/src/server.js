import express from "express";
import dotenv from "dotenv";
import connectedtoDB from "./database/mongodb.js"

dotenv.config();

import { PORT } from "./config/env.config.js";

const app = express();

connectedtoDB().
then(()=>{
app.listen(PORT, ()=>{
  console.log(`Serve is running on the port ${PORT}`)
})
}).catch((error)=>{
  console.log('Not connected with app with DB',error)
  process.exit(1);
})
