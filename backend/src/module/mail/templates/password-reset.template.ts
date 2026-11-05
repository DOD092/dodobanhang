import { MailTemplate, renderCodeBox, renderLayout } from './layout.template';

export function passwordResetTemplate(
  code: string,
  expireMinutes: number,
): MailTemplate {
  return {
    subject: 'Mã đặt lại mật khẩu Dodobanhang',
    html: renderLayout(`
      <h2 style="margin:0 0 12px">Đặt lại mật khẩu</h2>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhập mã dưới đây để tiếp tục:</p>
      ${renderCodeBox(code)}
      <p>Mã có hiệu lực trong <b>${expireMinutes} phút</b>.</p>
      <p style="color:#888888">Nếu không phải bạn yêu cầu, hãy bỏ qua email này — mật khẩu của bạn vẫn giữ nguyên.</p>
    `),
  };
}
