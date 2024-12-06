import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { UserRepository } from './users.repository';

@Module({
    imports : [TypeOrmModule.forFeature([
        Users,
      ]),
    ],
    providers: [UserRepository],
    exports : [UserRepository],
})
export class RepositoriesModule {}
