import { Gender } from 'src/common/enums/gender-enum';

export class ContactResponseDto {
  id: string;
  name: string;
  birthDate: Date;
  gender: Gender;
  age: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
