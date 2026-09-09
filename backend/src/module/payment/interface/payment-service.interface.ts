import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { Payment } from '../entities/payment.entity';

export interface IPaymentService {
  create(dto: CreatePaymentDto): Promise<Payment>;
  findAll(pagination: PaginationQueryDto): Promise<Payment[]>;
  findOne(id: string): Promise<Payment>;
  update(id: string, dto: UpdatePaymentDto): Promise<Payment>;
  remove(id: string): Promise<void>;
}
