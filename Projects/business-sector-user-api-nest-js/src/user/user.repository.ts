import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';

export const UserRepository = (dataSource: DataSource) => {
  return dataSource.getRepository(User).extend({
    async createUser(userDto: UserRegisterDto): Promise<User> {
      const { name, email, password } = userDto;

      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;

      await this.save(user);
      return user;
    },

    async findOneById(id: number): Promise<User | null> {
      return this.findOneBy({ id });
    },

    async findByEmail(email: string): Promise<User | null> {
      return this.findOneBy({ email });
    },

    async updateById(
      id: number,
      UserRegisterDto: Partial<UserRegisterDto>,
    ): Promise<User> {
      let user = await this.findOneBy({ id });
      if (!user) {
        throw new Error(`User with ID "${id}" not found`);
      }
      user = this.merge(user, UserRegisterDto);
      await this.save(user);
      return user;
    },
  });
};
