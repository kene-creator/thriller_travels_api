import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from 'src/user/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtQueryGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.get('IS_PUBLIC_KEY', ctx.getHandler());
    if (isPublic) {
      return true;
    }

    let decoded;
    const req: Request & { user: User } = ctx.switchToHttp().getRequest();
    const verifyOptions: JwtVerifyOptions = {
      algorithms: ['PS512'],
      publicKey: this.configService.get('JWT_PUBLIC_KEY'),
    };
    const {
      query: { token },
    } = req;

    if (typeof token !== 'string') {
      throw new UnauthorizedException('No token provided');
    }

    try {
      decoded = await this.jwtService.verifyAsync(token, verifyOptions);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    req.user = await this.userService.getUserByEmail(decoded.email);

    return true;
  }
}
