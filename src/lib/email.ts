import nodemailer from "nodemailer";

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

type SendWelcomeEmailParams = {
  to: string;
  nickname?: string;
};

function getSmtpPort() {
  const port = Number(process.env.SMTP_PORT || 465);
  return Number.isNaN(port) ? 465 : port;
}

function getSmtpSecure() {
  if (process.env.SMTP_SECURE) {
    return process.env.SMTP_SECURE === "true";
  }

  return getSmtpPort() === 465;
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send email.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: getSmtpPort(),
    secure: getSmtpSecure(),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function getFromAddress() {
  return `"Lilly" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "Reset your Lilly password",
    text: [
      "We received a request to reset your Lilly password.",
      "",
      `Open this link to choose a new password: ${resetUrl}`,
      "",
      "This link expires in 1 hour. If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">Reset your Lilly password</h1>
        <p>We received a request to reset your Lilly password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #9333ea; color: #ffffff; text-decoration: none;">
            Reset password
          </a>
        </p>
        <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, nickname }: SendWelcomeEmailParams) {
  const transporter = createTransporter();
  const greeting = nickname ? `Hi ${nickname},` : "Hi there,";

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "Welcome to Lilly",
    text: [
      greeting,
      "",
      "Welcome to Lilly. Your account is ready.",
      "",
      "You can now chat with Lilly, keep private journal entries, and track your mood over time.",
      "",
      "Thank you for trusting Lilly with a little corner of your day.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">Welcome to Lilly</h1>
        <p>${greeting}</p>
        <p>Your account is ready.</p>
        <p>You can now chat with Lilly, keep private journal entries, and track your mood over time.</p>
        <p>Thank you for trusting Lilly with a little corner of your day.</p>
      </div>
    `,
  });
}
