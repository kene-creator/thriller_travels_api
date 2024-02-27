import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
    type: AuthResponse,
  })
  async login(@GetUser() user: User): Promise<AuthResponse> {
    return this.authService.login(user);
  }
}
