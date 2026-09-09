import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADDRESS_REPOSITORY } from '../../common/dependency-injection/repository.tokens';
import { ADDRESS_SERVICE } from '../../common/dependency-injection/service.tokens';
import { Address } from './entities/address.entity';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])], // Dòng này quyết định việc sinh bảng
  controllers: [AddressController],
  providers: [
    { provide: ADDRESS_SERVICE, useClass: AddressService },
    { provide: ADDRESS_REPOSITORY, useClass: AddressRepository },
  ],
  exports: [ADDRESS_SERVICE],
})
export class AddressModule {}
