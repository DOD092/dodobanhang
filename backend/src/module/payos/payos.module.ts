import { Module } from '@nestjs/common';
import { PAYOS_SERVICE } from '../../common/dependency-injection/service.tokens';
import { PayosService } from './payos.service';

// Chỉ bọc SDK. Webhook nằm ở OrderModule (payos-webhook.controller.ts) vì phải cập nhật đơn hàng.
@Module({
  providers: [{ provide: PAYOS_SERVICE, useClass: PayosService }],
  exports: [PAYOS_SERVICE],
})
export class PayosModule {}
