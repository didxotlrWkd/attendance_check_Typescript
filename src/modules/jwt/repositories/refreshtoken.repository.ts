import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { Refreshtoken } from "../entities/Refreshtoken";

@Injectable()
export class RefreshTokenRepository{
    constructor(
        @InjectRepository(Refreshtoken)
        private readonly refreshtokenRespository : Repository<Refreshtoken>
    ){}

    async saveRefreshToken(refresh_token : string, user_id : number){
        try{
            const new_refresh_token = this.refreshtokenRespository.create({
                user_id,
                refresh_token,
            })

            await this.refreshtokenRespository.save(new_refresh_token)
            return
        }catch(err){
            throw err
        }
    }

    async findRefreshToken(user_id : number) {
        try{
            const find_refresh_token = await this.refreshtokenRespository.findOne({
                where : {
                    user_id
                }
            })

            return find_refresh_token.refresh_token
        }catch(err){
            throw err
        }
    }

    async deleteRefreshToken(refresh_token: string, user_id: number) {
        try {
            await this.refreshtokenRespository.delete({
                refresh_token,
                user_id,
            });
        } catch (err) {
            throw err;
        }
    }
}