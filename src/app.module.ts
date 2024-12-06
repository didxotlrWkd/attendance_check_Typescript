import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { Accesstokenblacklists } from './entities/Accesstokenblacklists';
import { Accesstokens } from './entities/Accesstokens';
import { Drawnusers } from './entities/Drawnusers';
import { Events } from './entities/Events';
import { Participants } from './entities/Participants';
import { Refreshtokenblacklists } from './entities/Refreshtokenblacklists';
import { Refreshtokens } from './entities/Refreshtokens';
import { Users } from './modules/users/entities/Users';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'http-exception.filter';

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
        Users,
        Accesstokenblacklists,
        Accesstokens,
        Drawnusers,
        Events,
        Participants,
        Refreshtokenblacklists,
        Refreshtokens,
      ],
      keepConnectionAlive: true, //hotreload시 디비 연결
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
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
