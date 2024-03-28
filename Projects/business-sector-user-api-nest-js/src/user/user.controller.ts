import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { EditUserDto } from './dto/edit-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  async register(@Body() createUserDto: UserRegisterDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно авторизован',
    type: String,
  })
  @ApiBody({
    type: UserLoginDto,
    description: 'Данные для входа пользователя',
  })
  async login(@Body() credentials: UserLoginDto) {
    return await this.userService.login(
      credentials.email,
      credentials.password,
    );
  }

  @Get('/profile/:id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь найден',
    type: UserResponseDto,
  })
  @ApiParam({ name: 'id', type: String, description: 'ID пользователя' })
  async getUser(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  @Put('/profile/:id')
  @ApiOperation({ summary: 'Редактирование пользователя' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID пользователя для обновления',
  })
  @ApiBody({ type: EditUserDto, description: 'Новые данные пользователя' })
  async updateUser(@Param('id') id: string, @Body() editUserDto: EditUserDto) {
    return await this.userService.update(+id, editUserDto);
  }

  @Get('/profiles')
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей получен',
    type: [UserResponseDto],
  })
  @ApiQuery({ name: 'page', type: Number, description: 'Номер страницы' })
  async getAllUsers(@Query('page') page: number = 1) {
    return await this.userService.findAll(page);
  }

  @Post('upload/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpg|jpeg|png/;
        const extension = allowedTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        const mimeType = allowedTypes.test(file.mimetype);

        if (extension && mimeType) {
          return callback(null, true);
        } else {
          return callback(
            new BadRequestException(
              'Только изображения формата jpg и png разрешены',
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'userId',
    required: true,
    type: 'number',
    description: 'ID пользователя',
  })
  @ApiBody({
    description: 'Файл для загрузки',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@Param('userId') userId: number, @UploadedFile() file: any) {
    return this.userService.saveFileData(userId, file);
  }
}
