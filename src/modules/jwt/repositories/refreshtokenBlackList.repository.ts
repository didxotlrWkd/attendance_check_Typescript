import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { Refreshtoken } from "../entities/Refreshtoken";
import { Refreshtokenblacklist } from "../entities/Refreshtokenblacklist";

@Injectable()
export class RefreshTokenBlackListRepository{
    constructor(
        @InjectRepository(Refreshtokenblacklist)
        private readonly refreshtokenBlackListRepository : Repository<Refreshtokenblacklist>
        ){}

    async saveRefreshToken(refresh_token : string, user_id : number){
        try{
            const new_blacklist_refresh_token = this.refreshtokenBlackListRepository.create({
                refresh_token,
            })

            await this.refreshtokenBlackListRepository.save(new_blacklist_refresh_token)
            return
        }catch(err){
            throw err
        }
    }
}