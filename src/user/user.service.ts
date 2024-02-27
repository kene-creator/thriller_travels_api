import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities';

@Injectable()
export class UserService {
  private static readonly saltRounds = 10;
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
  ) {}

  getUserPropertiesFromDto(createUserDto: CreateUserDto) {
    return {
      email: createUserDto.email,
      password: createUserDto.password,
    };
  }

  private async saveUser(createUserDto: CreateUserDto): Promise<User> {
    const userProperties = this.getUserPropertiesFromDto(createUserDto);
    const passwordHashed = await hash(
      userProperties.password,
      UserService.saltRounds,
    );

    const user = this.userRespository.create({
      ...userProperties,
      password: passwordHashed,
    });

    return this.userRespository.save(user);
  }

  async createUser(createUserDto: CreateUserDto) {
    let user: User;
    createUserDto.email = createUserDto.email;
    user = await this.userRespository
      .createQueryBuilder()
      .where('"email" = :email', { email: createUserDto.email })
      .getOne();

    if (
      user &&
      user.email.toLowerCase() === createUserDto.email.toLowerCase()
    ) {
      throw new ConflictException(`This email adress is not available`);
    }

    user = await this.saveUser(createUserDto);

    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = this.userRespository
        .createQueryBuilder('users')
        .select(['users.id', 'users.email', 'users.password'])
        .where('users.email = :email', { email: email });

      const user = await query.getOne();

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  async emailIsAvailable(email: string) {
    const user = await this.getUserByEmail(email);
    return !Boolean(user);
  }

  async getUserInfos(user: User, userId: string) {
    const searchedUser = await this.searchUser(userId);

    const userInfos = {
      id: searchedUser.id,
      email: searchedUser.email,
    };

    return userInfos;
  }

  async searchUser(userId: string) {
    const searchedUser = await this.userRespository.findOne({
      where: { id: userId },
    });

    if (!searchedUser) {
      throw new NotFoundException(`No user found for id ${userId}`);
    }

    return searchedUser;
  }

  async getUserBalance(userId: string): Promise<User> {
    const user = await this.userRespository.findOne({
      where: { id: userId },
      relations: ['transactions'],
    });
    return user;
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    await this.userRespository.update(userId, { balance: newBalance });
  }
}
