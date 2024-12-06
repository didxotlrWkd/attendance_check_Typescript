import { Column, Entity, Index, OneToMany } from "typeorm";
import { Participant } from "./Participant";

@Index("event_code", ["event_code"], {})
@Entity("events", { schema: "attendance_app" })
export class Event {
  
  @Column("varchar", { primary: true, name: "event_code", length: 255 })
  event_code: string;

  @Column("varchar", { name: "event_name", unique: true, length: 255 })
  event_name: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("varchar", { name: "location", length: 255 })
  location: string;

  @Column("datetime", { name: "event_start_time" })
  event_start_time: Date;

  @Column("datetime", { name: "event_end_time" })
  event_end_time: Date;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @OneToMany(() => Participant, (participants) => participants.event)
  participants: Participant[];
}
