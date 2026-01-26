import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter is ready');
    }
  });
}

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const APP_NAME = 'Freshmart';