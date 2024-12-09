import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cipher, createCipheriv, createDecipheriv, Decipher, scryptSync } from 'crypto';
import { User } from 'src/modules/user/entities/User';
import { LoginUserDto } from 'src/user/dto/login-user.dto';


@Injectable()
export class CrpytService {
    private readonly key: Buffer;
    private readonly algorithm: string;
    private readonly iv: string;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.key = scryptSync(this.configService.get<string>('CRYPT_KEY'), 'specialSalt', 32);
        this.algorithm = this.configService.get<string>('CRYPT_ALGORITHM');
        this.iv = this.configService.get<string>('CRYPT_IV'), 'hex'
    }

    encrypt(data: string): string {
        if (!data || typeof data !== 'string') {
          throw new BadRequestException('Invalid input: Data must be a non-empty string.');
        }
    
        let cipher: Cipher;
        try {
          cipher = createCipheriv(this.algorithm, this.key, this.iv);
        } catch (error) {
          throw new BadRequestException('Failed to create cipher: ' + error.message);
        }
    
        try {
          let result = cipher.update(data, 'utf8', 'hex');
          result += cipher.final('hex');
          return result; 
        } catch (error) {
          throw new BadRequestException('Encryption failed: ' + error.message);
        }
      }

    decrypt(data: string): string {
        if (!data || typeof data !== 'string') {
            throw new BadRequestException('Invalid input: Data must be a non-empty string.');
        }

        let decipher: Decipher;
        try {
            decipher = createDecipheriv(this.algorithm, this.key, this.iv);
        } catch (error) {
            throw new BadRequestException('Failed to create decipher: ' + error.message);
        }

        try {
            let result = decipher.update(data, 'hex', 'utf8');
            result += decipher.final('utf8');
            return result; 
        } catch (error) {
            throw new BadRequestException('Decryption failed: ' + error.message);
        }
    }

     encryptUserDto(loginUserDto : LoginUserDto) : LoginUserDto {
        try{
            const encrypt_student_code = this.encrypt(loginUserDto.student_code)
            const encrypt_name = this.encrypt(loginUserDto.name)

            return {
                student_code: encrypt_student_code,
                major : loginUserDto.major,
                name: encrypt_name,
                password : loginUserDto.password
              } as LoginUserDto; // 타입 단언
        } catch(err){
            throw new Error(err.message)
        }
    }

    decryptUserDto(user : User) : User{
      try{
        return {
          ...user,
          student_code : this.decrypt(user.student_code),
          name : this.decrypt(user.name),
        }
      }catch(err){
        throw err
      }
    }

    decryptUserInfo(users: User[]): User[] { 
      try {
          const decrypt_user_info = users.map(user => {
              return {
                  ...user,
                  student_code: this.decrypt(user.student_code),
                  name: this.decrypt(user.name),
              };
          });
          return decrypt_user_info;
      } catch (err) {
          throw err;
      }
  }

}