import nodemailer from 'nodemailer';
import {SMTP_PASSWORD, SMTP_USER} from '../config/env.config.js';

if (!SMTP_USER || !SMTP_PASSWORD) {
  console.error('SMTP credentials missing!');
  process.exit(1);
}


const transporter = nodemailer.createTransport({
  host:'smtp-relay.brevo.com',
  port:587,
  secure:false,
  auth:{
    user:SMTP_USER,
    pass: SMTP_PASSWORD
  },
  //logger:true,
  //debug:true
});
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Verification Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});
export default transporter;

