import { ContactDocument } from 'src/database/contacts.schema';
import { ContactResponseDto } from '../dtos/output/contact-response-dto';
import { CreateContactDto } from '../dtos/input/create-contact-dto';

export class ContactMapper {
  static toResponseDto(
    this: void,
    contact: ContactDocument,
    age: number,
  ): ContactResponseDto {
    return {
      id: contact._id.toString(),
      name: contact.name,
      birthDate: contact.birthDate,
      gender: contact.gender,
      age,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }

  static toListResponseDto = (contacts: ContactDocument[], ages: number[]) => ({
    contacts: contacts.map((contact, index) =>
      ContactMapper.toResponseDto(contact, ages[index]),
    ),
  });

  static toMongoCreate(createDto: CreateContactDto) {
    return {
      name: createDto.name,
      birthDate: new Date(createDto.birthDate),
      gender: createDto.gender,
      isActive: true,
    };
  }
}
