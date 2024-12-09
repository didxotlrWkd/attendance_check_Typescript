import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "../entities/Event";
import { Repository } from "typeorm"
import { Participant } from "../entities/Participant";
import { editEventDto } from "src/admin/dto/edit-event.dto";

@Injectable()
export class EventRepository {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(Participant)
        private readonly participantRepository: Repository<Participant>

    ) { }

    async addEvent(event: editEventDto) {
        try {
            const event_start_time_utc = new Date(new Date(event.event_start_time).getTime() - (9 * 60 * 60 * 1000));
            const event_end_time_utc = new Date(new Date(event.event_end_time).getTime() - (9 * 60 * 60 * 1000));
            const new_event = this.eventRepository.create({
                event_code: event.event_code,
                event_name: event.event_name,
                event_start_time: event_start_time_utc,
                event_end_time: event_end_time_utc,
                location: event.location,
                description: event.description
            })

            await this.eventRepository.save(new_event)
            return
        }catch(err){
            throw err
        }
    }

    async editEvent(event: editEventDto) {
        try {

            const event_start_time_utc = new Date(new Date(event.event_start_time).getTime() - (9 * 60 * 60 * 1000));
            const event_end_time_utc = new Date(new Date(event.event_end_time).getTime() - (9 * 60 * 60 * 1000));
            await this.eventRepository.update(
                { event_code: event.event_code },
                {
                    event_name: event.event_name,
                    event_start_time: event_start_time_utc,
                    event_end_time: event_end_time_utc,
                    location: event.location,
                    description: event.description
                }
            )
        } catch (err) {
            throw err
        }
    }

    async getEventInfo(event_code: string) {
        try {
            const event = await this.eventRepository.findOne({
                where: {
                    event_code
                }
            })

            return event
        } catch (err) {
            throw err
        }
    }

    async getAllEvents() {
        try {
            const events = await this.eventRepository.find({
                select: ['event_code', 'event_end_time', 'event_name', 'event_start_time', 'location'],
                order: {
                    event_start_time: 'ASC'
                }
            })
            return events
        } catch (err) {
            throw err
        }
    }

    async getEventListWithAttendance(user_id: number) {
        try {
            const event_list_with_attendance =
                await this.eventRepository
                    .createQueryBuilder('events')
                    .leftJoinAndSelect('events.participants', 'participant')
                    .where('participant.user_id = :userId OR participant.user_id IS NULL', { userId: user_id })
                    .select([
                        'events.event_code',
                        'events.event_name',
                        'events.location',
                        'events.description',
                        'events.event_start_time',
                        'events.event_end_time',
                        'participant.user_id',

                    ])
                    .getMany();

            return event_list_with_attendance
        } catch (err) {
            throw err
        }
    }

    async validEventCode(event_code: string) {
        try {
            const is_event_code = await this.eventRepository.findOne({
                where: {
                    event_code: event_code
                },
                select: ['event_code']
            })
            return is_event_code
        } catch (err) {
            throw err
        }
    }
}