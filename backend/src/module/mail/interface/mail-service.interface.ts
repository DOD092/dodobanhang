export interface ErrorAlertContext {
  method: string;
  path: string;
  statusCode: number;
  userId?: string;
}

export interface IMailService {
  sendVerificationEmail(email: string, verificationCode: string): Promise<void>;
  sendPasswordResetEmail(email: string, code: string): Promise<void>;
  sendErrorAlert(error: unknown, context: ErrorAlertContext): Promise<void>;
}
