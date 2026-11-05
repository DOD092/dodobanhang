import { MailTemplate, renderCodeBox, renderLayout } from './layout.template';

export function verificationTemplate(
  code: string,
  expireMinutes: number,
): MailTemplate {
  return {
    subject: 'Mã xác thực tài khoản Dodobanhang',
    html: renderLayout(`
      <h2 style="margin:0 0 12px">Xác thực tài khoản</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Nhập mã dưới đây để kích hoạt tài khoản:</p>
      ${renderCodeBox(code)}
      <p>Mã có hiệu lực trong <b>${expireMinutes} phút</b>.</p>
      <p style="color:#888888">Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
    `),
  };
}
