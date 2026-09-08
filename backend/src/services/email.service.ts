import nodemailer, { Transporter } from 'nodemailer';

const SMTP_HOST = 'smtp.zoho.com';
const SMTP_PORT = 465;

let transport: Transporter | null = null;

// Sends a notification to the club admin mailbox over Zoho SMTP
export async function sendAdminEmail(
  subject: string,
  text: string,
  html?: string,
): Promise<void> {
  const { ZOHO_SMTP_USER, ZOHO_SMTP_PASSWORD, NOTIFY_EMAIL } = process.env;
  if (!ZOHO_SMTP_USER || !ZOHO_SMTP_PASSWORD || !NOTIFY_EMAIL) {
    throw new Error('Unable to parse SMTP environment variables.');
  }

  transport ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: ZOHO_SMTP_USER, pass: ZOHO_SMTP_PASSWORD },
  });

  await transport.sendMail({
    from: ZOHO_SMTP_USER,
    to: NOTIFY_EMAIL,
    subject,
    text,
    html,
  });
}
