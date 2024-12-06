import { Inject, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm"
import { Participant } from "../entities/Participant";
import { Event } from "../entities/Event";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ParticipantRepository{
    constructor(
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private datasource: DataSource
    ) { }

    async createParticipant(event_code: string, user_id: number) {
        try {
            const new_participant = this.participantRepository.create({
                event_code,
                user_id
            })

            await this.participantRepository.save(new_participant)
        } catch (err) {
            throw err
        }
    }

    async searchParticipantList(user_id: number) {
        try {
            const participant_list =
                await this.participantRepository
                .createQueryBuilder('participant')
                .leftJoinAndSelect('participant.event', 'event') 
                .where('participant.user_id = :userId', { userId: user_id }) 
                .select(['event.event_code', 'event.event_name']) 
                .getMany();    
            return participant_list

            }catch(err){
                throw err
            }
    }
}
