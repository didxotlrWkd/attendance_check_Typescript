import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './participant.repository';
import { Participant } from '../entities/Participant';
import { Drawnuser } from '../entities/Drawnuser';



@Module({
    imports : [TypeOrmModule.forFeature([
      Participant,
      Event,
      Drawnuser,
      ]),
    ],
    providers: [ParticipantRepository],
    exports : [ParticipantRepository],
})
export class EventRepositoryModule {}
