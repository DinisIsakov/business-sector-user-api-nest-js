import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ example: 'Dinis', description: 'Имя пользователя' })
  @IsNotEmpty({ message: 'Имя пользователя не должно быть пустым' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Необходимо указать действительный email' })
  readonly email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Пароль пользователя',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  readonly password: string;
}
