import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Accesstoken } from "src/modules/jwt/entities/Accesstoken";
import { Drawnuser } from "src/modules/event/entities/Drawnuser";
import { Participant } from "src/modules/event/entities/Participant";
import { Refreshtoken } from "src/modules/jwt/entities/Refreshtoken";


@Entity("users", { schema: "attendance_app" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @ApiProperty({
    description: "학번"
  })
  @IsString()
  @Column("varchar", { name: "student_code", length: 255 })
  student_code: string;

  @ApiProperty({
    description: "학과"
  })
  @IsString()
  @Column("varchar", { name: "major", length: 255 })
  major: string;

  @ApiProperty({
    description: "이름"
  })
  @IsString()
  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ApiProperty({
    description: "해시화된 비밀번호"
  })
  @IsString()
  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @ApiProperty({
    description: "행사 참여횟수"
  })
  @IsNumber()
  @Column("int", { name: "participant_count", default: () => "'0'" })
  participantCount: number;

  @Column("datetime", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;


  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Accesstoken, (accesstokens) => accesstokens.user)
  accesstokens: Accesstoken[];

  @OneToMany(() => Drawnuser, (drawnusers) => drawnusers.user)
  drawnusers: Drawnuser[];

  @OneToMany(() => Participant, (participants) => participants.user)
  participants: Participant[];

  @OneToMany(() => Refreshtoken, (refreshtokens) => refreshtokens.user)
  refreshtokens: Refreshtoken[];
}
