import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreated, TokenCreated } from './interfaces/interfaces';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
      refreshToken: '',
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

  async login(loginUserDto: LoginUserDto): Promise<TokenCreated> {
    const userExists = await this.usersRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!userExists) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }

    const checkPw = await bcrypt.compare(
      loginUserDto.password,
      userExists.hash,
    );

    if (!checkPw) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.sign({ id: userExists.id });
    const refreshToken = this.jwtService.sign(
      {
        id: userExists.id,
      },
      { expiresIn: '7d' },
    );

    userExists.refreshToken = refreshToken;

    await this.usersRepository.save(userExists);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async refreshToken(authTokenDto: AuthTokenDto): Promise<TokenCreated> {
    const userExists = await this.usersRepository.findOne({
      where: {
        refreshToken: authTokenDto.refreshToken,
      },
    });

    if (!userExists) {
      throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
    }

    try {
      const isTokenExpired = await this.jwtService.verify(
        userExists.refreshToken,
      );
    } catch (err) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.sign({ id: userExists.id });
    const refreshToken = this.jwtService.sign(
      {
        id: userExists.id,
      },
      { expiresIn: '7d' },
    );

    userExists.refreshToken = refreshToken;

    await this.usersRepository.save(userExists);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
