import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreated } from './interfaces/user-interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserCreated> {
    const saltRounds = 12;

    const duplicatedEmail = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (duplicatedEmail) {
      throw new HttpException('Email already exists.', HttpStatus.CONFLICT);
    }

    const pwHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const newUser = {
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      hash: pwHash,
      lastLogin: new Date(),
    };

    const userCreated = await this.usersRepository.save(newUser);

    return {
      id: userCreated.id,
      name: userCreated.name,
      lastName: userCreated.lastName,
      email: userCreated.email,
    };
  }

  findAll() {
    return `This action returns all users`;
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
}
