import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/guards/public.guard';
import { TypeTokenPayload } from 'src/auth/types/TypeTokenPayload';

import { CreateUserDto, GetUserDto } from './dto';

import { User } from './entities/user.entity';

import { UserService } from './user.service';
import { GetUserInfosResponseAPI, GetUserResponseAPI } from './api_responses';
import { AuthResponse } from 'src/auth/types';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private formatUserInfos(user: User) {
    return {
      userId: user.id,
      email: user.email.toLowerCase(),
    };
  }

  @Public()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: AuthResponse,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponse> {
    const user = await this.userService.createUser(createUserDto);
    const payload: TypeTokenPayload = {
      email: user.email,
      sub: user.id,
    };
    return this.authService.getToken(payload);
  }

  @Get('/me')
  @ApiResponse({
    status: 200,
    description: 'User infos retrieved successfully',
    type: GetUserResponseAPI,
  })
  async getUserMeInfos(@GetUser() user: User) {
    return this.formatUserInfos(user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    type: GetUserInfosResponseAPI,
  })
  async getUserInfos(@GetUser() user: User, @Query() { userId }: GetUserDto) {
    const userInfos = await this.userService.getUserInfos(user, userId);
    return userInfos;
  }
}
