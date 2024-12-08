import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Drawnuser } from "../entities/Drawnuser";
import {Repository} from "typeorm"

@Injectable()
export class DrawnUserRepository{
    constructor(
        @InjectRepository(Drawnuser)
        private readonly drawnUserRepository : Repository<Drawnuser>
    ){}

    async checkDrawnUser() {
        try{
           const drawnUserIds =  await this.drawnUserRepository.find({
                select : ['user_id']
            })

            const drawnIds = drawnUserIds.map(user => user.user_id)

            return drawnIds
        }catch(err){
            throw err
        }
    }

    async addDrawnUser(user_id:number) {
        try{
            const drawn_user = this.drawnUserRepository.create({
                user_id
            })

            await this.drawnUserRepository.save(drawn_user)

        }catch(err){
            throw err
        }
    }
}