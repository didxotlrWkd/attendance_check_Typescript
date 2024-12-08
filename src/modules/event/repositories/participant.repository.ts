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

    async checkParticipant(event_code : string, user_id : number) {
        try{
            const is_duplicated_event_code = this.participantRepository.findOne({
                where : {
                    event_code,
                    user_id
                }
            })
            return is_duplicated_event_code
        }catch(err){
            throw err
        }
    }

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

    
}
