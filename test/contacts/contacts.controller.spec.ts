import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from 'src/modules/contacts/contacts.controller';
import { CreateContactDto } from 'src/modules/contacts/dtos/input/create-contact-dto';
import { Gender } from 'src/common/enums/gender-enum';
import { IContactsService } from 'src/modules/contacts/contracts/i-contacts';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: jest.Mocked<IContactsService>;

  const mockContact = {
    id: '1',
    name: 'João Silva',
    birthDate: new Date('1990-01-15'),
    gender: Gender.MALE,
    age: 36,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const serviceMock: jest.Mocked<IContactsService> = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      deactivate: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [{ provide: 'IContactsService', useValue: serviceMock }],
    }).compile();

    controller = module.get(ContactsController);
    service = module.get('IContactsService');

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return contacts with success message', async () => {
      service.getAll.mockResolvedValue({
        contacts: [mockContact],
      });

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Contatos encontrados com sucesso.',
        data: { contacts: [mockContact] },
        success: true,
      });
    });

    it('should return empty message when no contacts', async () => {
      service.getAll.mockResolvedValue({
        contacts: [],
      });

      const result = await controller.getAll();

      expect(result).toEqual({
        message: 'Nenhum contato encontrado.',
        data: { contacts: [] },
        success: true,
      });
    });
  });

  describe('getById', () => {
    it('should return contact by id', async () => {
      service.getById.mockResolvedValue(mockContact);

      const result = await controller.getById('1');

      expect(service.getById).toHaveBeenCalledWith('1');

      expect(result).toEqual({
        message: 'Contato encontrado com sucesso.',
        data: mockContact,
        success: true,
      });
    });
  });

  describe('create', () => {
    it('should create a contact', async () => {
      const dto: CreateContactDto = {
        name: 'João Silva',
        birthDate: '1990-01-15',
        gender: Gender.MALE,
      };

      service.create.mockResolvedValue(mockContact);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);

      expect(result).toEqual({
        message: 'Contato criado com sucesso.',
        data: mockContact,
        success: true,
      });
    });
  });

  describe('deactivate', () => {
    it('should deactivate a contact', async () => {
      service.deactivate.mockResolvedValue(undefined);

      await controller.deactivate('1');

      expect(service.deactivate).toHaveBeenCalledWith('1');
    });
  });

  describe('delete', () => {
    it('should delete a contact', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('1');

      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
