import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

function renderTemplate(templateName: string, context: Record<string, unknown>): string {
  const filePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, 'utf8');
  const template = Handlebars.compile(source);
  return template(context);
}

export async function sendEmail(to: string, subject: string, template: string, context: Record<string, unknown>): Promise<void> {
  const html = renderTemplate(template, context);
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
