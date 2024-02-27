import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

config();

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Thriller Travels')
    .setDescription('The Thriller Travels API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet());

  const port = 3001;

  await app.listen(port);
  logger.log(`App is listenning on port ${port}`);
}
bootstrap();
