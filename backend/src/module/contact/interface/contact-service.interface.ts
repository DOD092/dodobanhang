import { CreateContactDto } from '../dto/create-contact.dto';

export interface IContactService {
  /** `clientKey` (thường là IP) dùng để giới hạn số lần gửi. */
  submit(dto: CreateContactDto, clientKey: string): Promise<void>;
}
