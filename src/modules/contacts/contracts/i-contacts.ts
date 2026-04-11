import { CreateContactDto } from '../dtos/input/create-contact-dto';
import { ContactsListResponseDto } from '../dtos/output/contact-list-response-dto';
import { ContactResponseDto } from '../dtos/output/contact-response-dto';

export interface IContactsService {
  getAll(): Promise<ContactsListResponseDto>;
  getById(id: string): Promise<ContactResponseDto>;
  create(contact: CreateContactDto): Promise<ContactResponseDto>;
  deactivate(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
