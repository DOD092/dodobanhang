import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';

export const AVATAR_UPLOAD_DIR = join(process.cwd(), 'uploads', 'avatars');
export const AVATAR_URL_PREFIX = '/uploads/avatars/';

// Đuôi file lấy theo mimetype ĐÃ LỌC, không lấy từ tên file client gửi: trước đây
// `x.html` khai mimetype image/png được lưu thành .html và phát công khai qua /uploads
// -> trình duyệt chạy như trang HTML (stored XSS trên domain backend).
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const avatarUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
      cb(null, AVATAR_UPLOAD_DIR);
    },
    filename: (_req, file, cb) =>
      cb(null, `${randomUUID()}${EXTENSION_BY_MIME[file.mimetype] ?? '.img'}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!EXTENSION_BY_MIME[file.mimetype]) {
      return cb(new BadRequestException('Chỉ chấp nhận ảnh jpg, png, webp'), false);
    }
    cb(null, true);
  },
};
