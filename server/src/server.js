import express from "express";
import dotenv from "dotenv";
import connectedtoDB from "./database/mongodb.js"
import cookieParser from 'cookie-parser'
dotenv.config();

import { PORT } from "./config/env.config.js";
import userRouter from "./routes/user.routes.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//API EndPoint
app.use('/api/v1/auth',userRouter)

connectedtoDB().
then(()=>{
app.listen(PORT, ()=>{
  console.log(`Serve is running on the port ${PORT}`)
})
}).catch((error)=>{
  console.log('Not connected with app with DB',error)
  process.exit(1);
})
