import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Ok } from 'src/common/utils/response-util';
import { IContactsService } from './contracts/i-contacts';
import { CreateContactDto } from './dtos/input/create-contact-dto';

@Controller('contacts')
export class ContactsController {
  constructor(
    @Inject('IContactsService')
    private readonly contactsService: IContactsService,
  ) {}

  @HttpCode(200)
  @Get()
  async getAll() {
    const response = await this.contactsService.getAll();

    const message =
      response.contacts.length <= 0
        ? 'Nenhum contato encontrado.'
        : 'Contatos encontrados com sucesso.';

    return Ok(message, response);
  }

  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const response = await this.contactsService.getById(id);

    return Ok('Contato encontrado com sucesso.', response);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const response = await this.contactsService.create(createContactDto);

    return Ok('Contato criado com sucesso.', response);
  }

  @HttpCode(200)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    await this.contactsService.deactivate(id);

    return Ok('Contato desativado com sucesso.');
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.contactsService.delete(id);
  }
}
