import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { Gender } from 'src/common/enums/gender-enum';

export class CreateContactDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome do contato',
  })
  @IsString({ message: 'O campo [name] precisa ser uma string.' })
  @IsNotEmpty({ message: 'O campo [name] não pode estar vazio.' })
  name: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Data de nascimento do contato',
  })
  @IsDateString(
    {},
    { message: 'O campo [birthDate] precisa ser uma data válida.' },
  )
  @IsNotEmpty({ message: 'O campo [birthDate] não pode estar vazio.' })
  birthDate: string;

  @ApiProperty({
    example: 'M',
    description: 'Sexo do contato (M, F ou O)',
    enum: ['M', 'F', 'O'],
  })
  @IsEnum(['M', 'F', 'O'], {
    message: 'O campo [gender] precisa ser M, F ou O.',
  })
  @IsNotEmpty({ message: 'O campo [gender] não pode estar vazio.' })
  gender: Gender;
}
