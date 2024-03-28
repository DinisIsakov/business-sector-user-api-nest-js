import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @ApiPropertyOptional({ example: 'Dinis', description: 'Имя пользователя' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({
    example: 'Ivanov',
    description: 'Фамилия пользователя',
  })
  @IsOptional()
  @IsString()
  readonly surname?: string;

  @ApiPropertyOptional({
    example: 'test@test.com',
    description: 'Email пользователя',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({ example: 'Мужской', description: 'Пол пользователя' })
  @IsOptional()
  @IsString()
  readonly gender?: string;
}
