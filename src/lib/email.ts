import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// eSentry logo SVG
const ESENTRY_LOGO_SVG = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 1035.3 299.4" style="enable-background:new 0 0 1035.3 299.4;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#010101;}
	.st1{fill:url(#SVGID_1_);}
</style>
<g>
	<path class="st0" d="M122.3,25c2.2,1.6,4.4,3.2,6.5,4.8c-1.2,2.5-4.2,2.9-6.8,3.7c-0.6,0.2-1.1,0.5-1.7,0.6
		c-5.4,1.9-5.4,1.9-8.4,0.6c-2-1.1-3.9-2.3-5.8-3.6c-16-9.9-33.3-19.8-52.7-18.4c-3.5,0.9-5.3,2-7.3,5.1c-0.2,0.8-0.5,1.5-0.8,2.2
		c-0.2,0.5-0.3,0.9-0.5,1.4c-3.4,23.2,15.1,48.7,28.1,66.2c3.9,5.1,7.8,10.2,11.9,15.1c0.3,0.4,0.6,0.8,1.1,1.2
		c4.5,5.4,9.1,10.5,14.1,15.3c1.3,1.3,2.5,2.6,3.7,4c1.9,2.2,3.9,3.9,6,5.7c1.6,1.3,2.9,2.7,4.3,4.2c2.8,2.9,5.8,5.3,8.9,7.8
		c1.9,1.5,3.7,3,5.4,4.6c9.6,8.4,20.2,15.6,31.2,22c0.5,0.3,1.1,0.6,1.6,0.9c13.3,7.9,29.4,16.3,45.3,14.4c3.3-0.9,5.3-2.3,7.7-4.7
		c4.4-9.9,0.4-21.2-3.3-30.8c-4-10.2-9.5-19.6-15.7-28.7c-2.6-4-2.6-4-2.7-6.4c0.2-0.6,0.5-1.2,0.8-1.9c0.4-0.9,0.6-1.9,1.1-2.9
		c0.4-1.1,0.8-2.2,1.2-3.2c0.2-0.5,0.5-1.1,0.6-1.6c0.5-1.3,1.1-2.6,1.6-4c3.4,3.1,5.7,6.7,8.2,10.5c0.5,0.6,0.8,1.3,1.2,2
		c11.9,18.7,25.9,42.2,22.2,65.1c-3.3,14.4-17.4,24-29.3,31.5c-18.8,11.3-40.3,19.1-62.5,19.8c-0.5,0-1.1,0.1-1.6,0.1
		c-36.6,1.3-69.8-11.6-96.4-36.5c-0.6-0.6-1.2-1.2-1.9-1.8c-9.5-9-16.8-19.7-22.9-31.2c-0.2-0.5-0.5-0.9-0.8-1.3
		C-2,126.8-3.8,90.4,6.1,57.9c3.9-12.3,9.6-24.2,17.4-34.6c0.8-1.2,0.8-1.2,1.7-2.3C52.6-16.1,90.3,2.9,122.3,25z"/>
	<path class="st0" d="M22.7,299.4h-2.3c-0.2,0-0.4,0-0.5-0.1c-1.3-0.3-2.3-0.7-3.1-1.3c-1.9-1.4-2.8-3.7-2.6-6
		c0.1-2.2,0.7-4.3,1.5-6.6c0.2-0.5,0.3-0.9,0.5-1.4c0.5-1.5,0.9-2.9,1.4-4.4c0.4-1.1,0.6-2.2,1.1-3.2c0.9-2.8,1.8-5.6,2.7-8.5
		c0.9-2.9,1.9-5.8,2.8-8.7c1.1-3.5,2.2-7,3.3-10.4c3.2-10.1,6.4-20.2,9.5-30.2c0.5-1.8,1.1-3.6,1.6-5.3l0.4-1.5c0-0.1,0-0.1,0.1-0.1
		c0.1-0.5,0.2-0.9,0.3-1.2c0.4-1.6,2.2-2.3,3.5-1.4c2.7,1.8,5.4,3.7,8,5.7c19.4,14,43.2,21.7,66.8,24c0.6,0.1,1.3,0.2,2,0.2l0,0
		c0.9,0.1,1.6,0.8,1.9,1.6c2,6.1,3.9,12.2,5.8,18.3c0.9,3.1,1.9,6.1,2.9,9.2c0.9,2.9,1.9,5.9,2.8,8.8c0.4,1.1,0.8,2.3,1.1,3.4
		c0.5,1.6,1.1,3.2,1.5,4.7c0.3,0.9,0.6,1.7,0.9,2.6c0,0.1,0.1,0.1,0.1,0.2c0.7,2.9,1.1,5.4,0.1,8.1c-0.1,0.2-0.2,0.4-0.3,0.5
		c-0.7,1.1-0.9,1.5-2.9,2.9"/>
	<path class="st0" d="M49.2,299.4"/>
	<path class="st0" d="M206.4,42.4L206.4,42.4L206.4,42.4c0,0-2.8,9.6-3.1,10.5c-0.4,0.9-0.6,1.9-1.1,2.8c-0.4,0.9-0.6,1.9-1.1,2.9
		c-0.9,2.6-1.9,5.1-2.8,7.8c-0.8,2.2-1.6,4.3-2.3,6.4c-5.1,14.4-10.4,28.8-15.8,43.2c-1.2,3.4-2.5,6.8-3.7,10.2
		c-0.9,2.5-1.8,4.8-2.6,7.3c-0.5,1.1-0.8,2.3-1.2,3.4c-0.6,1.6-1.1,3.1-1.7,4.7c-0.3,0.9-0.6,1.8-0.9,2.6c-0.1,0.2-0.2,0.4-0.3,0.6
		c-1.2,2.6-3.7,4.3-6.5,4.4c-0.3,0-0.5,0-0.8-0.1c-1.9-0.2-3.6-1.2-4.7-2.7c-0.4-0.6-0.8-1.2-0.9-1.9c-0.4-1.2-0.4-2.4-0.2-3.6
		c0.5-3.2,1.8-6.3,2.9-9.4c0.3-0.8,0.6-1.6,0.9-2.5c0.8-2.2,1.6-4.4,2.5-6.7c1.4-3.7,2.8-7.4,4.2-11.2c0.5-1.5,1.1-2.9,1.6-4.3
		c3.9-10.5,7.7-21.1,11.5-31.6c0.5-1.6,7.9-23.3,7.9-23.3l0,0l0,0l0,0l0,0l0,0l0,0c-7.4,7.5-15,15.1-22.5,22.5
		c-3.5,3.5-7,7-10.4,10.5c-3.3,3.4-6.7,6.7-10.1,10.1c-1.2,1.2-2.6,2.6-3.9,3.9c-1.8,1.8-3.6,3.6-5.4,5.4c-0.5,0.5-1.1,1.1-1.6,1.6
		c-0.5,0.5-0.9,0.9-1.5,1.5c-0.5,0.5-0.8,0.9-1.2,1.2c-2.1,1.8-3.5,2.4-5.8,2.6c-0.9,0.1-1.8,0-2.6-0.2c-0.8-0.2-1.3-0.5-1.9-0.9
		c-1.1-0.9-1.9-2.2-2.3-3.6c-0.2-0.9-0.3-1.8-0.2-2.7c0.2-1.7,1-3.3,2.1-4.6c1.3-1.5,2.6-2.9,4-4.2c0.9-0.9,0.9-0.9,1.8-1.8
		c1.9-1.9,3.9-3.7,5.7-5.7c1.3-1.3,2.6-2.6,4-4c3.1-3.1,6.3-6.2,9.5-9.4c3.6-3.6,7.1-7.1,10.7-10.6c7.4-7.3,14.7-14.6,22-21.9
		c-4.4,1.3-8.8,2.6-13,4.2c-0.5,0.2-0.9,0.3-1.3,0.5c-0.9,0.3-1.8,0.6-2.7,0.9c-0.9,0.4-1.9,0.6-2.9,1.1c-2,0.8-4,1.5-6,2.2
		c-2.6,0.9-5.3,1.9-7.8,2.8c-10.2,3.7-20.5,7.4-30.7,11.2c-0.8,0.3-1.6,0.6-2.3,0.9c-3.6,1.3-7.3,2.7-10.9,4.2
		c-1.2,0.5-2.6,0.9-3.9,1.5c-0.6,0.2-1.1,0.5-1.7,0.6c-2.8,1.1-5.2,1.5-8,1.6c-1.9,0-3.9-0.7-5.1-2.2c-0.6-0.8-1.1-1.7-1.4-3v-0.1
		c-0.2-3.2,1.5-6.1,4.3-7.6c2.1-1.1,4.3-1.8,6.7-2.6c0.8-0.3,1.6-0.6,2.3-0.9c2.5-0.9,5-1.9,7.5-2.7c1.6-0.6,3.3-1.2,5-1.8
		c4.3-1.6,8.8-3.2,13.2-4.7c2.9-1.1,5.7-2,8.5-3.1c8.9-3.3,17.8-6.4,26.8-9.5c3.7-1.2,7.5-2.6,11.2-3.9c1.8-0.6,3.6-1.2,5.3-1.9
		c2.5-0.8,15-5.8,15-5.8l0,0l0,0"/>
	
		<radialGradient id="SVGID_1_" cx="204.3062" cy="301.2099" r="23.215" fx="187.2126" fy="316.9181" gradientTransform="matrix(1 0 0 1 0 -278)" gradientUnits="userSpaceOnUse">
		<stop  offset="0" style="stop-color:#BE3026"/>
		<stop  offset="0.4919" style="stop-color:#C03026"/>
		<stop  offset="0.6691" style="stop-color:#C73227"/>
		<stop  offset="0.7954" style="stop-color:#D23427"/>
		<stop  offset="0.8975" style="stop-color:#E33A26"/>
		<stop  offset="0.9839" style="stop-color:#EF402F"/>
		<stop  offset="1" style="stop-color:#EF4234"/>
	</radialGradient>
	<circle class="st1" cx="204.3" cy="23.2" r="23.2"/>
</g>
<g>
	<g>
		<path d="M345.3,229.9c-8.9,0-16.8-1.4-23.7-4.2c-6.9-2.8-12.8-6.7-17.6-11.5c-4.8-4.9-8.5-10.5-11-16.8c-2.5-6.4-3.8-13-3.8-20
			c0-9.9,2.2-19,6.7-27.2c4.4-8.2,10.8-14.7,19.2-19.7c8.4-5,18.4-7.4,30.2-7.4c11.8,0,21.9,2.5,30.2,7.4c8.4,4.9,14.7,11.4,19,19.5
			c4.3,8.1,6.5,16.8,6.5,26.1c0,1.8-0.1,3.6-0.3,5.4c-0.2,1.8-0.4,3.3-0.5,4.6H323c0.3,4.5,1.5,8.3,3.8,11.4c2.3,3.1,5.1,5.4,8.6,7
			c3.4,1.5,7,2.3,10.7,2.3c4.9,0,9.4-1.1,13.6-3.4c4.2-2.3,7-5.2,8.5-9l27.1,7.8c-2.7,5.4-6.4,10.2-11.1,14.2
			c-4.8,4-10.4,7.3-17,9.7C360.5,228.7,353.2,229.9,345.3,229.9z M322.4,166.6h45.2c-0.4-4.2-1.7-7.9-3.8-11c-2.1-3.1-4.8-5.6-8-7.3
			s-6.9-2.6-11.1-2.6c-3.8,0-7.4,0.9-10.7,2.6c-3.3,1.7-6,4.1-8,7.2S322.8,162.3,322.4,166.6z"/>
		<path d="M502.6,128.1c-0.4-0.4-1.8-1.4-4.3-2.9c-2.5-1.5-5.4-3.1-9-4.7c-3.5-1.6-7.4-2.9-11.6-4.1c-4.2-1.1-8.5-1.7-12.7-1.7
			c-5.6,0-9.9,1-12.9,3c-3.1,2-4.6,4.9-4.6,8.7c0,3,1.2,5.5,3.5,7.4c2.3,1.9,5.7,3.5,10,4.9s9.7,2.9,16.1,4.6
			c9,2.5,16.8,5.4,23.5,8.8c6.6,3.4,11.7,7.7,15.2,12.9c3.5,5.3,5.3,12.2,5.3,20.9c0,7.8-1.4,14.4-4.3,20
			c-2.9,5.6-6.8,10.1-11.9,13.4c-5.1,3.4-10.8,5.8-17.1,7.3c-6.3,1.5-12.8,2.3-19.6,2.3c-6.9,0-14-0.7-21.2-2.2
			c-7.2-1.5-14.2-3.5-20.8-6.2c-6.6-2.7-12.7-5.7-18.3-9.2l14.1-28.6c0.7,0.8,2.5,2.1,5.4,3.8c2.9,1.7,6.5,3.5,10.8,5.5
			c4.3,1.9,9.1,3.6,14.4,5.2c5.3,1.5,10.6,2.3,15.9,2.3c6,0,10.4-0.9,13.2-2.8c2.9-1.9,4.3-4.4,4.3-7.7c0-3.4-1.5-6.2-4.5-8.2
			c-3-2-7-3.9-12.1-5.5c-5.1-1.6-11-3.4-17.6-5.2c-8.6-2.8-15.7-5.8-21.4-9c-5.6-3.2-9.8-7.2-12.5-12c-2.7-4.7-4.1-10.6-4.1-17.6
			c0-10,2.4-18.4,7.1-25.2c4.7-6.8,11-11.9,19-15.4s16.6-5.2,26.1-5.2c6.8,0,13.2,0.8,19.3,2.4c6.1,1.6,11.9,3.6,17.3,6
			c5.4,2.4,10.1,4.8,14.1,7.4L502.6,128.1z"/>
		<path d="M587.5,229.9c-8.9,0-16.8-1.4-23.7-4.2c-6.9-2.8-12.8-6.7-17.6-11.5c-4.8-4.9-8.5-10.5-11-16.8c-2.5-6.4-3.8-13-3.8-20
			c0-9.9,2.2-19,6.7-27.2c4.4-8.2,10.8-14.7,19.2-19.7c8.4-5,18.4-7.4,30.2-7.4c11.8,0,21.9,2.5,30.2,7.4c8.4,4.9,14.7,11.4,19,19.5
			c4.3,8.1,6.5,16.8,6.5,26.1c0,1.8-0.1,3.6-0.3,5.4c-0.2,1.8-0.4,3.3-0.5,4.6h-77.2c0.3,4.5,1.5,8.3,3.8,11.4
			c2.3,3.1,5.1,5.4,8.6,7c3.4,1.5,7,2.3,10.7,2.3c4.9,0,9.4-1.1,13.6-3.4c4.2-2.3,7-5.2,8.5-9l27.1,7.8c-2.7,5.4-6.4,10.2-11.1,14.2
			c-4.8,4-10.4,7.3-17,9.7C602.7,228.7,595.5,229.9,587.5,229.9z M564.6,166.6h45.2c-0.4-4.2-1.7-7.9-3.8-11c-2.1-3.1-4.8-5.6-8-7.3
			s-6.9-2.6-11.1-2.6c-3.8,0-7.4,0.9-10.7,2.6c-3.3,1.7-6,4.1-8,7.2S565,162.3,564.6,166.6z"/>
		<path d="M758.4,227.9h-31.8v-57.6c0-6.8-1.4-11.7-4.1-14.7c-2.7-3.1-6.1-4.6-10.2-4.6c-2.9,0-5.9,0.8-9,2.3
			c-3.1,1.5-5.8,3.7-8.4,6.3c-2.5,2.7-4.4,5.8-5.6,9.2v59.1h-31.8V124.7h28.6v17.6c2.7-4.2,6-7.7,9.9-10.6c4-2.9,8.6-5,13.7-6.5
			c5.2-1.4,10.7-2.2,16.7-2.2c6.9,0,12.4,1.2,16.6,3.5c4.2,2.4,7.4,5.5,9.5,9.3c2.2,3.9,3.7,8.1,4.5,12.7c0.8,4.6,1.2,9,1.2,13.3
			V227.9z"/>
		<path d="M846.7,222.1c-2.8,1.3-5.9,2.6-9.4,3.8c-3.5,1.2-7.2,2.2-10.9,2.9c-3.8,0.7-7.6,1.1-11.4,1.1c-5.3,0-10.1-0.9-14.5-2.6
			c-4.4-1.8-7.9-4.7-10.5-8.7c-2.7-4-4-9.4-4-16.1v-53.5h-13.3v-24.3h13.3V91.3h31.8v33.4h21.1v24.3h-21.1v42.2c0.1,3.5,1,6,2.6,7.5
			c1.6,1.5,3.8,2.2,6.6,2.2c2.4,0,4.8-0.4,7.3-1.3c2.5-0.9,4.7-1.6,6.7-2.3L846.7,222.1z"/>
		<path d="M925.5,150.7c-7.7,0-14.7,1.2-20.9,3.7c-6.2,2.5-10.7,6.1-13.5,10.8v62.7h-31.8V124.7h29v19.9c3.7-7,8.4-12.5,14.1-16.5
			c5.7-4,11.7-6,17.9-6.2c1.5,0,2.5,0,3.2,0c0.7,0,1.3,0.1,2,0.2V150.7z"/>
		<path d="M939.8,243.6c2.7,0.8,5.1,1.4,7.5,1.9c2.3,0.5,4.4,0.7,6.3,0.7c2.7,0.1,4.8-0.4,6.5-1.5c1.7-1.1,3.2-3,4.6-5.8
			s2.6-6.3,3.5-10.7l-39.6-103.6h32.8l24.5,71.2l20.7-71.2h29.8L996.5,245c-1.9,5.7-4.7,10.7-8.6,15c-3.8,4.3-8.5,7.8-14,10.3
			c-5.5,2.5-11.4,3.7-17.8,3.6c-2.7,0-5.3-0.2-8.1-0.7c-2.7-0.5-5.5-1.2-8.3-2.3V243.6z"/>
	</g>
</g>
</svg>
`;

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

  // Convert SVG string to base64
  const logoBase64 = Buffer.from(ESENTRY_LOGO_SVG).toString("base64");

  // Create MIME email with inline image
  const boundary = `----=_Part${Date.now()}`;
  const altBoundary = `----=_Alt${Date.now()}`;

  const rawMessage = [
    `From: ${fromEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/related; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${altBoundary}"`,
    ``,
    ...(text
      ? [
          `--${altBoundary}`,
          `Content-Type: text/plain; charset=UTF-8`,
          `Content-Transfer-Encoding: 7bit`,
          ``,
          text,
          ``,
        ]
      : []),
    `--${altBoundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    html,
    ``,
    `--${altBoundary}--`,
    ``,
    `--${boundary}`,
    `Content-Type: image/svg+xml; name="logo.svg"`,
    `Content-Transfer-Encoding: base64`,
    `Content-ID: <logo>`,
    `Content-Disposition: inline; filename="logo.svg"`,
    ``,
    logoBase64,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  const command = new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(rawMessage),
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
                  <img src="cid:logo" alt="eSentry" style="height: 40px; display: block;" />
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
                  <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; border-radius: 6px; transition: background-color 0.2s;">
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
                  <img src="cid:logo" alt="eSentry" style="height: 40px; display: block;" />
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
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; border-radius: 6px; transition: background-color 0.2s;">
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
