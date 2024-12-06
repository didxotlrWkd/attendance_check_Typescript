import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Event } from "./Event";
import { User } from "src/modules/user/entities/User";

@Index("event_code", ["event_code"], {})
@Index("user_id", ["user_id"], {})
@Entity("participants", { schema: "attendance_app" })
export class Participant {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("int", { name: "user_id", nullable: true })
  user_id: number | null;

  @Column("varchar", { name: "event_code", nullable: true, length: 255 })
  event_code: string | null;

  @ManyToOne(() => Event, (events) => events.participants, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "event_code", referencedColumnName: "event_code" }])
  event: Event;

  @ManyToOne(() => User, (users) => users.participants, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
