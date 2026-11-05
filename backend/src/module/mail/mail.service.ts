import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  ErrorAlertContext,
  IMailService,
} from './interface/mail-service.interface';
import {
  MailTemplate,
  errorAlertTemplate,
  passwordResetTemplate,
  verificationTemplate,
} from './templates';

// Cùng một lỗi (method + path + message) chỉ gửi cảnh báo 1 lần trong khoảng này,
// tránh 1 bug bị gọi liên tục làm ngập hộp thư / bị Gmail chặn vì spam.
const ALERT_THROTTLE_MS = 5 * 60 * 1000;

// Khớp với thời hạn mã trong AuthService (verificationExpireAt / passwordResetExpireAt).
const CODE_EXPIRE_MINUTES = 5;

@Injectable()
export class MailService implements IMailService {
  private readonly logger = new Logger(MailService.name);
  // null khi chưa cấu hình MAIL_USER/MAIL_PASSWORD: chỉ log ra console,
  // để ai chưa có App Password vẫn chạy được app ở máy mình.
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;
  private readonly alertEmail?: string;
  private readonly lastAlertAt = new Map<string, number>();

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASSWORD');
    const port = Number(this.configService.get<string>('MAIL_PORT') ?? 465);

    this.transporter =
      user && pass
        ? nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST') ?? 'smtp.gmail.com',
            port,
            secure: port === 465, // 465 = SSL ngay từ đầu, 587 = STARTTLS
            auth: { user, pass },
          })
        : null;
    this.from =
      this.configService.get<string>('MAIL_FROM') ?? `Dodobanhang <${user}>`;
    this.alertEmail = this.configService.get<string>('ALERT_EMAIL');

    if (!this.transporter) {
      this.logger.warn(
        'Chưa cấu hình MAIL_USER/MAIL_PASSWORD -> email chỉ được log ra console.',
      );
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await this.send(email, verificationTemplate(verificationCode, CODE_EXPIRE_MINUTES));
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    await this.send(email, passwordResetTemplate(code, CODE_EXPIRE_MINUTES));
  }

  // Gọi từ HttpExceptionFilter khi có lỗi 5xx. Không bao giờ ném lỗi ra ngoài:
  // mail hỏng thì chỉ log, không được làm hỏng thêm response đang trả cho client.
  async sendErrorAlert(error: unknown, context: ErrorAlertContext): Promise<void> {
    if (!this.alertEmail) return;

    const message = error instanceof Error ? error.message : String(error);

    const key = `${context.method} ${context.path} ${message}`;
    const now = Date.now();
    const last = this.lastAlertAt.get(key);
    if (last && now - last < ALERT_THROTTLE_MS) return;
    this.lastAlertAt.set(key, now);

    const env = this.configService.get<string>('NODE_ENV') ?? 'development';
    try {
      await this.send(this.alertEmail, errorAlertTemplate(error, context, env));
    } catch (mailError) {
      this.logger.error(`Gửi email cảnh báo lỗi thất bại: ${mailError}`);
    }
  }

  private async send(to: string, { subject, html }: MailTemplate): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[MAIL-DEV] to=${to} | subject=${subject}\n${html}`);
      return;
    }
    await this.transporter.sendMail({ from: this.from, to, subject, html });
  }
}
