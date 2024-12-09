import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as nunjucks from 'nunjucks';
import { join } from 'path';
import { Redirect, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { RedirectFilter } from 'http-redirect-exception.filter';
import passport from 'passport';
require('dotenv').config()

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Nunjucks 설정
  nunjucks.configure(join(__dirname, '..', 'views'), {
    autoescape: true,
    express: app,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('attendance_app API')
    .setDescription('출석앱 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('nunjucks');

  app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RedirectFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true, 
    }))

  app.use(passport.initialize());
  app.use(passport.session()); 

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();