import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MAIL_SERVICE } from '../../common/dependency-injection/service.tokens';
import { IMailService } from '../mail/interface/mail-service.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { IContactService } from './interface/contact-service.interface';

// Endpoint công khai, mỗi lần gọi là 1 email -> chặn spam đơn giản theo IP.
// Bộ nhớ trong process: restart là reset, chạy nhiều instance thì mỗi instance đếm riêng.
// Đủ cho 1 server; khi scale thì chuyển sang @nestjs/throttler + Redis.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

@Injectable()
export class ContactService implements IContactService {
  private readonly hits = new Map<string, number[]>();

  constructor(
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
  ) {}

  async submit(dto: CreateContactDto, clientKey: string): Promise<void> {
    this.assertNotRateLimited(clientKey);
    await this.mailService.sendContactMessage(dto);
  }

  private assertNotRateLimited(key: string): void {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter(
      (time) => now - time < WINDOW_MS,
    );

    if (recent.length >= MAX_PER_WINDOW) {
      this.hits.set(key, recent);
      throw new HttpException(
        'Bạn đã gửi quá nhiều liên hệ, vui lòng thử lại sau ít phút hoặc gọi điện trực tiếp.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    this.hits.set(key, recent);

    // Dọn key cũ để Map không phình mãi
    if (this.hits.size > 10_000) {
      for (const [k, times] of this.hits) {
        if (times.every((time) => now - time >= WINDOW_MS)) this.hits.delete(k);
      }
    }
  }
}
