import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const dataSource = app.get(DataSource);
  const config = app.get(ConfigService);
  const port = config.get('server.port');
  await app.listen(port);
  logger.log(`Application listen port ${port}`);
  logger.log(
    `Database is connecting with ${JSON.stringify(dataSource.options)}`,
  );
}

bootstrap();
