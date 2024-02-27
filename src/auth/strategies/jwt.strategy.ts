import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import { TypeTokenPayload } from '../types/TypeTokenPayload';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        JwtStrategy.extractJwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_PUBLIC_KEY'),
    });
  }

  private static extractJwt(@Req() req: Request): string | null {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies['accessToken'];
    } else if (req.cookies && 'token' in req.cookies) {
      const token = req.cookies['token'];
      const tokenParts = token.split('; ');
      const accessTokenPart = tokenParts.find((part) =>
        part.startsWith('accessToken='),
      );

      if (accessTokenPart) {
        return accessTokenPart.split('=')[1];
      }
    } else if (req.cookies && 'accessToken' in req.cookies) {
      const cookieString = req.cookies['accessToken'];
      const accessToken = cookieString.match(/(.*?),/);
      if (accessToken) {
        return accessToken[1];
      }
    }

    return null;
  }

  async validate(validationPayload: Required<TypeTokenPayload>) {
    return this.userService.getUserByEmail(validationPayload.email);
  }
}
