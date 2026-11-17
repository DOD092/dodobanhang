import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CONTACT_SERVICE } from '../../common/dependency-injection/service.tokens';
import { CreateContactDto } from './dto/create-contact.dto';
import { IContactService } from './interface/contact-service.interface';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(
    @Inject(CONTACT_SERVICE) private readonly contactService: IContactService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary:
      'Form liên hệ trên web: gửi email tới hộp thư công ty (CONTACT_EMAIL)',
    description: 'Không lưu DB. Tối đa 5 lần / 10 phút / IP.',
  })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Đã gửi' })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Gửi quá nhiều',
  })
  async submit(@Body() dto: CreateContactDto, @Ip() ip: string) {
    await this.contactService.submit(dto, ip);
    return { sent: true };
  }
}
