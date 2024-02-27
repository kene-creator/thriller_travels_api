import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { TypeTokenDecoded } from './types/TypeTokenDecoded';
import { TypeTokenPayload } from './types/TypeTokenPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    console.log('valaidat_2', user.password);

    if (!user) {
      return null;
    }

    const passwordsMatched = await bcrypt.compare(password, user.password);

    return passwordsMatched ? user : null;
  }

  async getToken(payload: TypeTokenPayload) {
    const options: JwtSignOptions = {
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      privateKey: this.configService.get('JWT_PRIVATE_KEY'),
      algorithm: 'PS512',
    };
    const accessToken = await this.jwtService.signAsync(payload, options);

    const decoded = this.jwtService.decode(accessToken, {
      json: true,
    }) as TypeTokenDecoded;

    return {
      accessToken,
      accessTokenExpirationDate: decoded.exp * 1e3,
      userId: payload.sub,
    };
  }

  login(user: User) {
    const payload: TypeTokenPayload = {
      email: user.email,
      sub: user.id,
    };

    return this.getToken(payload);
  }

  async verify(token: string) {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user = await this.userService.getUserByEmail(decoded.email);

    if (!user) {
      throw new ForbiddenException(
        'Unable to get the user from the given token',
      );
    }

    return user;
  }
}
