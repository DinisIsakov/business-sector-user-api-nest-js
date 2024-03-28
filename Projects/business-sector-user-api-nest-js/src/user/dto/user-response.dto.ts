import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'ID пользователя' })
  readonly id: number;

  @ApiProperty({ example: 'Dinis', description: 'Имя пользователя' })
  readonly name: string;

  @ApiProperty({ example: 'Ivanov', description: 'Фамилия пользователя' })
  readonly surname: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'Email пользователя',
  })
  readonly email: string;

  @ApiProperty({ example: 'Не указан', description: 'Пол пользователя' })
  readonly gender: string;

  @ApiProperty({ example: null, description: 'Фотография пользователя' })
  readonly photo: string | null;

  @ApiProperty({
    example: '2024-03-27T13:32:44.000Z',
    description: 'Дата регистрации пользователя',
  })
  readonly registrationDate: Date;
}
