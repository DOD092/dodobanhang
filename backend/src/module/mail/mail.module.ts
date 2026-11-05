import { Module } from '@nestjs/common';
import { MAIL_SERVICE } from '../../common/dependency-injection/service.tokens';
import { MailService } from './mail.service';

@Module({
  providers: [{ provide: MAIL_SERVICE, useClass: MailService }],
  exports: [MAIL_SERVICE],
})
export class MailModule {}
