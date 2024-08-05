import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find(
      (user) => user.username === registerUserDto.username,
    );
    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    users.push(user);

    await this.dbService.write(users);
    return user;
  }
  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find(
      (user) => user.username === loginUserDto.username,
    );
    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('Incorrect password');
    }
    return foundUser;
  }
}
