import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("AWS_SES_FROM_EMAIL environment variable is not set");
  }

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },
        ...(text && {
          Text: {
            Data: text,
            Charset: "UTF-8",
          },
        }),
      },
    },
  });

  try {
    const result = await sesClient.send(command);
    console.log("Email sent successfully:", result.MessageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function createVerificationEmailTemplate(verificationUrl: string, userName?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email Address</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
      </div>

      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello${userName ? ` ${userName}` : ''}!</h2>

        <p style="font-size: 16px; margin-bottom: 20px;">
          Thank you for signing up! To complete your registration and verify your email address, please click the button below:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Verify Email Address
          </a>
        </div>

        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
          If the button doesn't work, you can also copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #007bff; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #dee2e6;">
          ${verificationUrl}
        </p>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
          This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hello${userName ? ` ${userName}` : ''}!

    Thank you for signing up! To complete your registration and verify your email address, please visit the following link:

    ${verificationUrl}

    This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
  `;

  return { html, text };
}

export function createPasswordResetEmailTemplate(resetUrl: string, userName?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
      </div>

      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hello${userName ? ` ${userName}` : ''}!</h2>

        <p style="font-size: 16px; margin-bottom: 20px;">
          We received a request to reset your password. If you made this request, click the button below to set a new password:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                    display: inline-block;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
          If the button doesn't work, you can also copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #007bff; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; border: 1px solid #dee2e6;">
          ${resetUrl}
        </p>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

        <p style="font-size: 12px; color: #6c757d; text-align: center; margin: 0;">
          This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hello${userName ? ` ${userName}` : ''}!

    We received a request to reset your password. If you made this request, please visit the following link to set a new password:

    ${resetUrl}

    This password reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
  `;

  return { html, text };
}