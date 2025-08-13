import express from "express";
import dotenv from "dotenv";
//import connectedtoDB from "./src/database/mongodb.js"
import connectedtoDB from '../server/src/database/mongodb.js';
import cookieParser from 'cookie-parser'
dotenv.config();
import cors from 'cors';

//import { PORT } from "./src/config/env.config.js";
import { PORT } from './src/config/env.config.js'
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.route.js";

const app = express();

const allowedOrigin = ['http://localhost:5173',
  //'https://log-auth-one.vercel.app',
'https://log-auth-2tw2.vercel.app']
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
//app.use(cors({origin:allowedOrigin, credentials:true}))
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigin.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));


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
