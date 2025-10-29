import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { env } from '../config/env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string; // template name in emails/templates
  context?: Record<string, unknown>;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? Number(env.SMTP_PORT) : 587,
    secure: false,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  });

  private compileTemplate(templateName: string) {
    const file = path.join(__dirname, '..', 'emails', 'templates', `${templateName}.hbs`);
    const content = fs.readFileSync(file, 'utf8');
    return handlebars.compile(content);
  }

  async send(options: SendEmailOptions): Promise<void> {
    const template = this.compileTemplate(options.template);
    const html = template(options.context ?? {});
    await this.transporter.sendMail({ from: env.EMAIL_FROM, to: options.to, subject: options.subject, html });
  }
}
