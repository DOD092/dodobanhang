import { Global, Module } from '@nestjs/common';
import { UnitOfWork } from './unit-of-work';

// @Global() để mọi module inject UnitOfWork mà không cần import lại module này.
@Global()
@Module({
  providers: [UnitOfWork],
  exports: [UnitOfWork],
})
export class UnitOfWorkModule {}
