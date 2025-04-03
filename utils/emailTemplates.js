const welcomeTemplate = (username, otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4a6bff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4a6bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            background-color: #f5f5f5;
        }
        .highlight {
            background-color: #f0f5ff;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .otp-box {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4a6bff;
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">

        <div class="header">
            <h1>Welcome to Our Pingit!</h1>
        </div>
        
        <div class="content">
            <p>Hello ${username},</p>
            
            <p>Thank you for joining our platform! We're excited to have you on board.</p>
            
            <p>To complete your registration, please use the following OTP to verify your email:</p>
            
            <div style="text-align: center;">
                <div class="otp-box">${otp}</div>
            </div>
            
            <p class="highlight">
                <strong>Note:</strong> This OTP will expire in 10 minutes.
            </p>
            
            <p>If you didn't create this account, please ignore this email or contact support.</p>
            
            <p>Best regards,<br>Our Platform Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const passwordResetTemplate = (username, resetLink) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff6b4a;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #ff6b4a;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            background-color: #f5f5f5;
        }
        .warning {
            color: #ff6b4a;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        
        <div class="content">
            <p>Hello ${username},</p>
            
            <p>We received a request to reset your password for your account.</p>
            
            <p>To reset your password, please click the button below:</p>
            
            <p style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            
            <p class="warning">This link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team immediately.</p>
            
            <p>Best regards,<br>Our Platform Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const passwordChangeConfirmationTemplate = (username) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #4CAF50;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
            background-color: #f5f5f5;
        }
        .checkmark {
            color: #4CAF50;
            font-size: 48px;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Password Changed Successfully</h1>
        </div>
        
        <div class="content">
            <div class="checkmark">✓</div>
            
            <p>Hello ${username},</p>
            
            <p>Your password has been successfully changed.</p>
            
            <p>If you didn't make this change, please contact our support team immediately.</p>
            
            <p>Best regards,<br>Our Platform Team</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
    welcomeTemplate,
    passwordResetTemplate,
    passwordChangeConfirmationTemplate
};