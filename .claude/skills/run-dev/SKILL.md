---
name: run-dev
description: Chạy, build, kiểm thử app dodobanhang (backend NestJS cổng 3000 + frontend Next.js cổng 3001), Swagger, chụp màn hình bằng Edge headless. Dùng khi cần khởi động app, kiểm tra thay đổi chạy thật, build, hoặc debug lỗi khởi động.
---

# Chạy dodobanhang

Gốc repo **không có `package.json`**: luôn chạy npm trong `backend/` hoặc `frontend/`.

```bash
cd backend  && npm run start:dev   # http://localhost:3000/api · Swagger /swagger/index.html · JSON /swagger-json
cd frontend && npm run dev         # http://localhost:3001  (cần backend chạy)
```

Chạy cả 2 bằng `run_in_background`; **tắt tiến trình tự mở khi xong** (không chiếm cổng 3000/3001 của người dùng).

| Kiểm tra | Lệnh |
| --- | --- |
| Backend type/compile | `cd backend && npm run build` |
| Frontend type + build | `cd frontend && npm run build` (cần mạng cho `next/font`; không cần backend) |
| Gọi API nhanh | `curl http://localhost:3000/api/products/search?limit=1` |

## Lưu ý

- Backend boot vào **DB Aiven dùng chung** (`synchronize: true`). Nhánh có entity khác `dev` → đọc skill `db-safety` trước khi boot.
- Lỗi "Unable to connect to the database" → xem dòng `query failed:` phía trên.
- Terminal VS Code bật Auto Attach → in "Debugger attached.", build có vẻ treo; không phải lỗi project, không tự đổi cài đặt VS Code.
- Chụp mobile bằng Edge headless: nhúng trang vào `<iframe width="390">` (headless không nhỏ hơn ~500px). File HTML tạm trong `public/` phải xoá ngay sau khi chụp.
- Nút tròn "N" góc dưới trái = chỉ báo `next dev`.
