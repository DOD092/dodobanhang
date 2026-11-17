import { ContactMessage } from '../interface/mail-service.interface';
import { MailTemplate, escapeHtml, renderLayout } from './layout.template';

// Mọi field đều do khách nhập trên web -> escape hết trước khi đưa vào HTML.
export function contactTemplate(message: ContactMessage): MailTemplate {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#888888;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:6px 0">${escapeHtml(value)}</td>
    </tr>`;

  return {
    // Tiêu đề không chứa HTML nên không cần escape, chỉ bỏ xuống dòng (chặn header injection)
    subject: `Liên hệ mới từ website: ${message.name.replace(/[\r\n]+/g, ' ')}`,
    html: renderLayout(`
      <h2 style="margin:0 0 12px">Khách hàng gửi liên hệ</h2>
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:15px">
        ${row('Họ tên', message.name)}
        ${row('Điện thoại', message.phone)}
        ${row('Email', message.email)}
        ${message.address ? row('Địa chỉ', message.address) : ''}
      </table>
      <p style="margin:16px 0 4px;color:#888888">Nội dung:</p>
      <div style="padding:12px;background:#fafafa;border-radius:6px;white-space:pre-wrap">${escapeHtml(message.content)}</div>
      <p style="color:#888888;font-size:13px">Bấm "Trả lời" để phản hồi thẳng tới email của khách.</p>
    `),
  };
}
