import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Events } from "./Events";
import { Users } from "src/modules/users/entities/Users";

@Index("event_code", ["eventCode"], {})
@Index("user_id", ["userId"], {})
@Entity("participants", { schema: "attendance_app" })
export class Participants {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("varchar", { name: "event_code", nullable: true, length: 255 })
  eventCode: string | null;

  @ManyToOne(() => Users, (users) => users.participants, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Events, (events) => events.participants, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "event_code", referencedColumnName: "eventCode" }])
  eventCode2: Events;
}
