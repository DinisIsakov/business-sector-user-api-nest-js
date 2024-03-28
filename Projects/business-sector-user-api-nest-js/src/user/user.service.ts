import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dto/user-response.dto';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(userDto: UserRegisterDto): Promise<User> {
    const { email, password, name } = userDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      gender: 'Не указан',
      photo: null,
    });

    await this.userRepository.save(newUser);
    delete newUser.password;
    return newUser;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToUserResponseDto(user);
  }

  async update(id: number, editUserDto: EditUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    Object.assign(user, editUserDto);
    await this.userRepository.save(user);

    return this.mapToUserResponseDto(user);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: UserResponseDto[];
    page: number;
    limit: number;
    total: number;
  }> {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { registrationDate: 'DESC' },
    });

    return {
      users: users.map((user) => this.mapToUserResponseDto(user)),
      page,
      limit,
      total,
    };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async saveFileData(userId: number, file: any): Promise<any> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.photo = file.filename;
    await this.userRepository.save(user);

    return { message: 'File successfully uploaded', fileName: file.filename };
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      gender: user.gender,
      photo: user.photo,
      registrationDate: user.registrationDate,
    };
  }
}
