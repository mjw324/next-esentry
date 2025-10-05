import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


const ESENTRY_LOGO_URL = "https://jerivdh89r3zqerl.public.blob.vercel-storage.com/esentry-name-icon-light.png";

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

export function createVerificationEmailTemplate(
  verificationUrl: string,
  userName?: string
) {
  const displayName = userName || "there";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Verify Email Address</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              
              <!-- Logo Section -->
              <tr>
                <td align="center" style="padding: 48px 40px 32px 40px;">
                  <img src="${ESENTRY_LOGO_URL}" alt="eSentry" style="height: 40px; display: block;" />
                </td>
              </tr>
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 0 40px 24px 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;">
                    Verify Email Address
                  </h1>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    Hi ${displayName},
                  </p>
                  <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    We received your request to verify your email address. Tap the link below to verify this email address and start using eSentry.
                  </p>
                </td>
              </tr>
              
              <!-- Button -->
              <tr>
                <td align="center" style="padding: 0 40px 48px 40px;">
                  <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; transition: background-color 0.2s;">
                    Verify Email
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
eSentry

Verify Email Address

Hi ${displayName},

We received your request to verify your email address. Tap the link below to verify this email address and start using eSentry.

${verificationUrl}

If you didn't request this email, you can safely ignore it.

---
eSentry
  `.trim();

  return { html, text };
}

export function createPasswordResetEmailTemplate(
  resetUrl: string,
  userName?: string
) {
  const displayName = userName || "there";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Reset Your Password</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              
              <!-- Logo Section -->
              <tr>
                <td align="center" style="padding: 48px 40px 32px 40px;">
                  <img src="${ESENTRY_LOGO_URL}" alt="eSentry" style="height: 40px; display: block;" />
                </td>
              </tr>
              
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 0 40px 24px 40px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;">
                    Reset Your Password
                  </h1>
                </td>
              </tr>
              
              <!-- Body Content -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    Hi ${displayName},
                  </p>
                  <p style="margin: 0 0 16px 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    We received a request to reset your password for your eSentry account. Click the button below to create a new password.
                  </p>
                  <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
                    This link will expire in 1 hour for security reasons.
                  </p>
                </td>
              </tr>
              
              <!-- Button -->
              <tr>
                <td align="center" style="padding: 0 40px 48px 40px;">
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px; transition: background-color 0.2s;">
                    Reset Password
                  </a>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
eSentry

Reset Your Password

Hi ${displayName},

We received a request to reset your password for your eSentry account. Click the link below to create a new password.

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

---
eSentry
  `.trim();

  return { html, text };
}