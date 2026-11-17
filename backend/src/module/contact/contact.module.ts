import { Module } from '@nestjs/common';
import { CONTACT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { MailModule } from '../mail/mail.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

// Không có entity/repository: form liên hệ chỉ gửi email, không lưu bảng.
@Module({
  imports: [MailModule],
  controllers: [ContactController],
  providers: [{ provide: CONTACT_SERVICE, useClass: ContactService }],
  exports: [CONTACT_SERVICE],
})
export class ContactModule {}
