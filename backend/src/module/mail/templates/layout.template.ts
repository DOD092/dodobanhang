// Mỗi template trả về đủ tiêu đề + nội dung, MailService chỉ việc gửi đi.
export interface MailTemplate {
  subject: string;
  html: string;
}

const BRAND_NAME = 'Dodobanhang';
const BRAND_COLOR = '#ee4d2d';

// Dữ liệu động (tên, mã, message lỗi...) có thể đến từ client -> luôn escape
// trước khi nhét vào HTML.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Khung chung: header + nội dung + footer. Dùng table + inline style vì
// Gmail/Outlook bỏ qua thẻ <style> và nhiều thuộc tính CSS hiện đại.
export function renderLayout(content: string): string {
  return `
<!doctype html>
<html lang="vi">
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden">
            <tr>
              <td style="background:${BRAND_COLOR};padding:20px 24px;color:#ffffff;font-size:22px;font-weight:bold">
                ${BRAND_NAME}
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#333333;font-size:15px;line-height:1.6">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#fafafa;color:#999999;font-size:12px;text-align:center">
                Email tự động từ ${BRAND_NAME}, vui lòng không trả lời email này.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Khối hiển thị mã 6 số, dùng chung cho xác thực tài khoản và quên mật khẩu.
export function renderCodeBox(code: string): string {
  return `
    <div style="margin:24px 0;padding:16px;background:#fff4f1;border:1px dashed ${BRAND_COLOR};border-radius:6px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:${BRAND_COLOR}">
      ${escapeHtml(code)}
    </div>`;
}
