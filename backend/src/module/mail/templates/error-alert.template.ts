import { ErrorAlertContext } from '../interface/mail-service.interface';
import { MailTemplate, escapeHtml, renderLayout } from './layout.template';

export function errorAlertTemplate(
  error: unknown,
  context: ErrorAlertContext,
  env: string,
): MailTemplate {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? (error.stack ?? '') : '';

  return {
    subject: `[${env}] Lỗi ${context.statusCode}: ${context.method} ${context.path}`,
    html: renderLayout(`
      <h2 style="margin:0 0 12px;color:#d32f2f">Server gặp lỗi ${context.statusCode}</h2>
      <table role="presentation" cellpadding="4" cellspacing="0" style="font-size:14px">
        <tr><td><b>Môi trường</b></td><td>${escapeHtml(env)}</td></tr>
        <tr><td><b>Thời gian</b></td><td>${new Date().toISOString()}</td></tr>
        <tr><td><b>Request</b></td><td>${escapeHtml(context.method)} ${escapeHtml(context.path)}</td></tr>
        <tr><td><b>User</b></td><td>${escapeHtml(context.userId ?? 'chưa đăng nhập')}</td></tr>
        <tr><td><b>Message</b></td><td>${escapeHtml(message)}</td></tr>
      </table>
      <pre style="margin-top:16px;padding:12px;background:#f4f4f4;border-radius:4px;font-size:12px;white-space:pre-wrap;word-break:break-all">${escapeHtml(stack)}</pre>
    `),
  };
}
