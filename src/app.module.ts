import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'http-exception.filter';
import { User } from './modules/user/entities/User';
import { Participant } from './modules/event/entities/Participant';
import { Event } from './modules/event/entities/Event';
import { Accesstokenblacklist } from './modules/jwt/entities/Accesstokenblacklist';
import { Accesstoken } from './modules/jwt/entities/Accesstoken';
import { Drawnuser } from './modules/event/entities/Drawnuser';
import { Refreshtokenblacklist } from './modules/jwt/entities/Refreshtokenblacklist';
import { Refreshtoken } from './modules/jwt/entities/Refreshtoken';



@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    AdminModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [
        User,
        Participant,
        Accesstokenblacklist,
        Accesstoken,
        Drawnuser,
        Event,
        Refreshtokenblacklist,
        Refreshtoken,
      ],
      keepConnectionAlive: true, //hotreload시 디비 연결
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
      timezone: '+09:00',
      synchronize: false, //true로 생성 후 false로 변경
      logging: true, //sql문 확인하고 비효율적일시 수정
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
