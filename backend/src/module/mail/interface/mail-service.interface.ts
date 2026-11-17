export interface ErrorAlertContext {
  method: string;
  path: string;
  statusCode: number;
  userId?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  address?: string;
  content: string;
}

export interface IMailService {
  sendVerificationEmail(email: string, verificationCode: string): Promise<void>;
  sendPasswordResetEmail(email: string, code: string): Promise<void>;
  sendErrorAlert(error: unknown, context: ErrorAlertContext): Promise<void>;
  /** Gửi tin nhắn form liên hệ tới hộp thư công ty (CONTACT_EMAIL). Reply-To = email khách. */
  sendContactMessage(message: ContactMessage): Promise<void>;
}
