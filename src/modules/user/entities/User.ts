import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Accesstoken } from "src/modules/jwt/entities/Accesstoken";
import { Drawnuser } from "src/modules/event/entities/Drawnuser";
import { Participant } from "src/modules/event/entities/Participant";
import { Refreshtoken } from "src/modules/jwt/entities/Refreshtoken";


@Entity("users", { schema: "attendance_app" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "student_code", length: 255 })
  student_code: string;


  @Column("varchar", { name: "major", length: 255 })
  major: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;


  @Column("int", { name: "participant_count", default: () => "'0'" })
  participant_count: number;

  @Column("datetime", {
    name: "createdAt",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @DeleteDateColumn({ name: "deletedAt", nullable: true }) // 소프트 삭제를 위한 열
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
