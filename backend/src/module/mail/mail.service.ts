import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    // sau này dùng nodemailer hoặc mail provider để gửi thật
    console.log(
      `Send code ${verificationCode} to ${email}`,
    );
  }

  async sendPasswordResetEmail(
    email: string,
    code: string,
  ): Promise<void> {
    console.log(
      `Password reset code ${code} sent to email: ${email}`,
    );
  }
}