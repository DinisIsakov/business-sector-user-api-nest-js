import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email пользователя' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Пароль пользователя' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
