import { APP_NAME, FRONTEND_URL } from '../config';

interface RegistrationData {
  name: string;
}

export const getRegistrationEmail = ({ name }: RegistrationData) => {
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
    .button { 
      display: inline-block; 
      padding: 14px 36px; 
      background: #4CAF50; 
      color: white !important; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: bold; 
      margin: 25px 0;
    }
    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    h1 { margin: 0; font-size: 28px; }
    h2 { color: #2c3e50; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 Welcome to ${APP_NAME}!</h1>
    </div>
    
    <div class="content">
      <h2>Hi ${name},</h2>
      
      <p>Thank you for registering with ${APP_NAME}! We're thrilled to have you join our community of fresh food lovers.</p>
      
      <p>Your account is now active and you're ready to:</p>
      <ul>
        <li>Browse hundreds of fresh groceries</li>
        <li>Grab exclusive deals & discounts</li>
        <li>Enjoy fast doorstep delivery</li>
        <li>Track orders in real-time</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="${FRONTEND_URL}" class="button">Start Shopping Now →</a>
      </p>
      
      <p>Questions? Our support team is just a message away.</p>
      
      <p>Happy shopping!<br>The ${APP_NAME} Team</p>
    </div>
    
    <div class="footer">
      <p>© ${year} ${APP_NAME}. All rights reserved.</p>
      <p>You received this email because you signed up at ${APP_NAME}.</p>
    </div>
  </div>
</body>
</html>
  `;
};