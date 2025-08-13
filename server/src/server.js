import express from "express";
import dotenv from "dotenv";
import connectedtoDB from "./database/mongodb.js"
import cookieParser from 'cookie-parser'
dotenv.config();
import cors from 'cors';

import { PORT } from "./config/env.config.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.route.js";

const app = express();

const allowedOrigin = ['http://localhost:5173','https://log-auth-one.vercel.app']
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:allowedOrigin, credentials:true}))


//API EndPoints
app.get('/', (req, res) => {
  res.send('Backend is running—use /api/v1/auth or other endpoints.');
});

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)

connectedtoDB().
then(()=>{
app.listen(PORT, ()=>{
  console.log(`Serve is running on the port http://localhost:${PORT}`)
})
}).catch((error)=>{
  console.log('Not connected with app with DB',error)
  process.exit(1);
})
