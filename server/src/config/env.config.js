import {config} from "dotenv";
config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});
export const {
  PORT,
  MONGODB_URI,
  JWT_SECRET_KEY,
  expiresIn,
  NODE_ENV,
  SMTP_USER,
  SMTP_PASSWORD,
  SENDER_EMAIL

} = process.env;