import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import { join } from 'path';
import { Redirect, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { RedirectFilter } from 'http-redirect-exeption.filter';
import { TransformResponseInterceptor } from './common/interceptor/transform.interceptor';
require('dotenv').config()

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  nunjucks.configure(join(__dirname, '..', 'views'), {
    autoescape: true,
    express: app,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('attendance_app API')
    .setDescription('출석앱 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('nunjucks');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RedirectFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }))

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();