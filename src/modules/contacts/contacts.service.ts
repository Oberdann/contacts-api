import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IContactsService } from './contracts/i-contacts';
import { Contact, ContactDocument } from 'src/database/contacts.schema';
import { Model } from 'mongoose';
import { ContactInvalidBirthDateException } from './exceptions/contact-invalid-birth-date-exception';
import { ContactUnderageException } from './exceptions/contact-underage-exception';
import { ContactsListResponseDto } from './dtos/output/contact-list-response-dto';
import { ContactMapper } from './mapper/contacts.mapper';
import { ContactResponseDto } from './dtos/output/contact-response-dto';
import { CreateContactDto } from './dtos/input/create-contact-dto';
import { ContactAlreadyInactiveException } from './exceptions/contact-already-inactive-exception';
import { ContactNotFoundException } from './exceptions/contact-not-found-exception';

@Injectable()
export class ContactsService implements IContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async getAll(): Promise<ContactsListResponseDto> {
    const contacts = await this.contactModel.find({ isActive: true });

    const ages = contacts.map((contact) =>
      this.calculateAge(contact.birthDate),
    );

    const response = ContactMapper.toListResponseDto(contacts, ages);

    return response;
  }

  async getById(id: string): Promise<ContactResponseDto> {
    const contact = await this.findContactOrFail(id);

    const age = this.calculateAge(contact.birthDate);

    const response = ContactMapper.toResponseDto(contact, age);

    return response;
  }

  async create(createDto: CreateContactDto): Promise<ContactResponseDto> {
    this.validateBirthDate(new Date(createDto.birthDate));

    const data = ContactMapper.toMongoCreate(createDto);

    const created = await this.contactModel.create(data);

    const age = this.calculateAge(created.birthDate);

    const response = ContactMapper.toResponseDto(created, age);

    return response;
  }

  async deactivate(id: string): Promise<void> {
    const contact = await this.findContactOrFail(id);

    if (!contact.isActive) {
      throw new ContactAlreadyInactiveException(
        `O contato com ID ${id} já está inativo.`,
      );
    }

    await this.contactModel.updateOne({ _id: id }, { isActive: false });
  }

  async delete(id: string): Promise<void> {
    await this.findContactOrFail(id);

    await this.contactModel.deleteOne({ _id: id });
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birthStr = new Date(birthDate).toISOString().split('T')[0];

    const [birthYear, birthMonth, birthDay] = birthStr.split('-').map(Number);

    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthMonth - 1,
      birthDay,
    );

    const age = today.getFullYear() - birthYear;

    return today >= thisYearBirthday ? age : age - 1;
  }

  private validateBirthDate(birthDate: Date): void {
    const today = new Date().toISOString().split('T')[0];
    const birth = new Date(birthDate).toISOString().split('T')[0];

    if (birth > today) {
      throw new ContactInvalidBirthDateException(
        'A data de nascimento não pode ser maior que a data de hoje.',
      );
    }

    const age = this.calculateAge(new Date(birthDate));

    if (age < 18) {
      throw new ContactUnderageException('O contato deve ser maior de idade.');
    }
  }

  private async findContactOrFail(id: string): Promise<ContactDocument> {
    const contact = await this.contactModel.findById(id);

    if (!contact || !contact.isActive) {
      throw new ContactNotFoundException(
        `Contato com ID ${id} não encontrado.`,
      );
    }

    return contact;
  }
}
