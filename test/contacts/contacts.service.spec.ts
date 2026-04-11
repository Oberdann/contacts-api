import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ContactsService } from 'src/modules/contacts/contacts.service';
import { ContactNotFoundException } from 'src/modules/contacts/exceptions/contact-not-found-exception';
import { ContactAlreadyInactiveException } from 'src/modules/contacts/exceptions/contact-already-inactive-exception';
import { CreateContactDto } from 'src/modules/contacts/dtos/input/create-contact-dto';
import { Gender } from 'src/common/enums/gender-enum';
import { Contact } from 'src/database/contacts.schema';
import { ContactMapper } from 'src/modules/contacts/mapper/contacts.mapper';
import { ContactInvalidBirthDateException } from 'src/modules/contacts/exceptions/contact-invalid-birth-date-exception';
import { ContactUnderageException } from 'src/modules/contacts/exceptions/contact-underage-exception';

jest.mock('src/modules/contacts/mapper/contacts.mapper');

type MockModel = {
  find: jest.Mock;
  findById: jest.Mock;
  create: jest.Mock;
  updateOne: jest.Mock;
  deleteOne: jest.Mock;
};

describe('ContactsService', () => {
  let service: ContactsService;
  let model: MockModel;

  const mockContact = {
    _id: '1',
    name: 'João Silva',
    birthDate: new Date('1990-01-15'),
    gender: Gender.MALE,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContactResponse = {
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
    const modelMock: MockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: getModelToken(Contact.name), useValue: modelMock },
      ],
    }).compile();

    service = module.get(ContactsService);
    model = module.get(getModelToken(Contact.name));

    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all active contacts', async () => {
      model.find.mockResolvedValue([mockContact]);

      (ContactMapper.toListResponseDto as jest.Mock).mockReturnValue({
        contacts: [mockContactResponse],
      });

      const result = await service.getAll();

      expect(model.find).toHaveBeenCalledWith({ isActive: true });
      expect(ContactMapper.toListResponseDto).toHaveBeenCalled();
      expect(result).toEqual({ contacts: [mockContactResponse] });
    });

    it('should return empty list', async () => {
      model.find.mockResolvedValue([]);

      (ContactMapper.toListResponseDto as jest.Mock).mockReturnValue({
        contacts: [],
      });

      const result = await service.getAll();

      expect(result).toEqual({ contacts: [] });
    });
  });

  describe('getById', () => {
    it('should return contact by id', async () => {
      model.findById.mockResolvedValue(mockContact);

      (ContactMapper.toResponseDto as jest.Mock).mockReturnValue(
        mockContactResponse,
      );

      const result = await service.getById('1');

      expect(model.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockContactResponse);
    });

    it('should throw if contact not found', async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.getById('1')).rejects.toThrow(
        ContactNotFoundException,
      );
    });

    it('should throw if contact is inactive', async () => {
      model.findById.mockResolvedValue({ ...mockContact, isActive: false });

      await expect(service.getById('1')).rejects.toThrow(
        ContactAlreadyInactiveException,
      );
    });
  });

  describe('create', () => {
    const dto: CreateContactDto = {
      name: 'João Silva',
      birthDate: '1990-01-15',
      gender: Gender.MALE,
    };

    it('should create a contact', async () => {
      model.create.mockResolvedValue(mockContact);

      (ContactMapper.toMongoCreate as jest.Mock).mockReturnValue({
        name: dto.name,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender,
        isActive: true,
      });

      (ContactMapper.toResponseDto as jest.Mock).mockReturnValue(
        mockContactResponse,
      );

      const result = await service.create(dto);

      expect(model.create).toHaveBeenCalled();
      expect(result).toEqual(mockContactResponse);
    });

    it('should throw if birthDate is in the future', async () => {
      const futureDto: CreateContactDto = {
        ...dto,
        birthDate: '2099-01-15',
      };

      await expect(service.create(futureDto)).rejects.toThrow(
        ContactInvalidBirthDateException,
      );
    });

    it('should throw if contact is underage', async () => {
      const underageDto: CreateContactDto = {
        ...dto,
        birthDate: '2010-01-15',
      };

      await expect(service.create(underageDto)).rejects.toThrow(
        ContactUnderageException,
      );
    });
  });

  describe('deactivate', () => {
    it('should deactivate a contact', async () => {
      model.findById.mockResolvedValue(mockContact);
      model.updateOne.mockResolvedValue({});

      await service.deactivate('1');

      expect(model.updateOne).toHaveBeenCalledWith(
        { _id: '1' },
        { isActive: false },
      );
    });

    it('should throw if contact not found', async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.deactivate('1')).rejects.toThrow(
        ContactNotFoundException,
      );
    });

    it('should throw if contact is already inactive', async () => {
      model.findById.mockResolvedValue({ ...mockContact, isActive: false });

      await expect(service.deactivate('1')).rejects.toThrow(
        ContactAlreadyInactiveException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a contact', async () => {
      model.findById.mockResolvedValue(mockContact);
      model.deleteOne.mockResolvedValue({});

      await service.delete('1');

      expect(model.deleteOne).toHaveBeenCalledWith({ _id: '1' });
    });

    it('should throw if contact not found', async () => {
      model.findById.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(
        ContactNotFoundException,
      );
    });
  });
});
