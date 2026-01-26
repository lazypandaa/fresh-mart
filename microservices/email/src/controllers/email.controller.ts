import type { Request, Response } from 'express';
import { transporter } from '../config';
import { getRegistrationEmail } from '../templates/registration';

export const sendRegistrationEmail = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required fields',
      });
    }

    const html = getRegistrationEmail({ name });

    const mailOptions = {
      from: `${process.env.APP_NAME || 'Freshmart'} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Freshmart! 🎉 Your account is ready',
      html,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Welcome email sent successfully',
    });
  } catch (error: any) {
    console.error('Registration email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send registration email',
      error: error.message,
    });
  }
};

export const sendGenericEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: 'to, subject, and (text or html) are required',
      });
    }

    const mailOptions = {
      from: `${process.env.APP_NAME || 'Freshmart'} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    console.error('Generic email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
};