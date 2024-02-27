import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModule,
  JwtModuleOptions,
  JwtSecretRequestType,
  JwtService,
} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: JwtModuleOptions = {
          secretOrKeyProvider: (requestType: JwtSecretRequestType) => {
            switch (requestType) {
              case JwtSecretRequestType.SIGN:
                return configService.get('JWT_PRIVATE_KEY');
              case JwtSecretRequestType.VERIFY:
                return configService.get('JWT_PUBLIC_KEY');
              default:
                return configService.get('JWT_PRIVATE_KEY');
            }
          },
          signOptions: {
            expiresIn: '365d',
            issuer: 'webest-scool-api',
            algorithm: 'PS512',
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
