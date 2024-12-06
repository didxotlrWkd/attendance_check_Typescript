import { Column, Entity, Index, OneToMany } from "typeorm";
import { Participants } from "./Participants";

@Index("event_code", ["eventCode"], { unique: true })
@Index("event_name", ["eventName"], { unique: true })
@Entity("events", { schema: "attendance_app" })
export class Events {
  @Column("varchar", { primary: true, name: "event_code", length: 255 })
  eventCode: string;

  @Column("varchar", { name: "event_name", unique: true, length: 255 })
  eventName: string;

  @Column("varchar", { name: "description", length: 255 })
  description: string;

  @Column("varchar", { name: "location", length: 255 })
  location: string;

  @Column("datetime", { name: "event_start_time" })
  eventStartTime: Date;

  @Column("datetime", { name: "event_end_time" })
  eventEndTime: Date;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @OneToMany(() => Participants, (participants) => participants.eventCode2)
  participants: Participants[];
}
