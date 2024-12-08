import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './participant.repository';
import { Participant } from '../entities/Participant';
import { Drawnuser } from '../entities/Drawnuser';
import { EventRepository } from './event.repository';
import { Event } from '../entities/Event';
import { DrawnUserRepository } from './drawnUser.repository';



@Module({
    imports : [TypeOrmModule.forFeature([
      Participant,
      Event,
      Drawnuser,
      ]),
    ],
    providers: [ParticipantRepository, EventRepository, DrawnUserRepository],
    exports : [ParticipantRepository, EventRepository, DrawnUserRepository],
})
export class EventRepositoryModule {}
