import { APP_NAME, FRONTEND_URL } from "../config";

interface OtpEmailData {
  name: string;
  otp: string;
  expiresInMinutes?: number;
}

export const getOtpVerificationEmail = ({
  name,
  otp,
  expiresInMinutes = 10,
}: OtpEmailData) => {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
    .header { background: #4CAF50; color: white; padding: 40px 30px; text-align: center; }
    .content { background: white; padding: 40px 30px; }
    .otp-box {
      font-size: 32px;
      letter-spacing: 6px;
      font-weight: bold;
      background: #f1f8f5;
      border: 2px dashed #4CAF50;
      padding: 18px;
      text-align: center;
      border-radius: 8px;
      margin: 30px 0;
      color: #2c3e50;
    }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    h1 { margin: 0; font-size: 28px; }
    h2 { color: #2c3e50; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 ${APP_NAME} Verification Code</h1>
    </div>

    <div class="content">
      <h2>Hi ${name},</h2>

      <p>Use the OTP below to verify your email address.</p>

      <div class="otp-box">${otp}</div>

      <p>
        This code will expire in <strong>${expiresInMinutes} minutes</strong>.
        Please do not share this code with anyone.
      </p>

      <p>If you didn’t request this, you can safely ignore this email.</p>

      <p>Thanks,<br>The ${APP_NAME} Team</p>
    </div>

    <div class="footer">
      <p>© ${year} ${APP_NAME}. All rights reserved.</p>
      <p>This is an automated message — please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
};
