import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { isProduction } from './config/isProduction';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_PUBLIC_KEY: Joi.string().required(),
        JWT_PRIVATE_KEY: Joi.string().required(),
      }),
      ...(isProduction() ? null : { envFilePath: '../.env' }),
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
