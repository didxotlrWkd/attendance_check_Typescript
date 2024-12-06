import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Refreshtokens } from "src/entities/Refreshtokens";
import { Accesstokens } from "src/entities/Accesstokens";
import { Drawnusers } from "src/entities/Drawnusers";
import { Participants } from "src/entities/Participants";

@Entity("users", { schema: "attendance_app" })
export class Users {
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

  @OneToMany(() => Accesstokens, (accesstokens) => accesstokens.user)
  accesstokens: Accesstokens[];

  @OneToMany(() => Drawnusers, (drawnusers) => drawnusers.user)
  drawnusers: Drawnusers[];

  @OneToMany(() => Participants, (participants) => participants.user)
  participants: Participants[];

  @OneToMany(() => Refreshtokens, (refreshtokens) => refreshtokens.user)
  refreshtokens: Refreshtokens[];
}
