import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("refreshtokenblacklists", { schema: "attendance_app" })
export class Refreshtokenblacklist {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "refresh_token", length: 255 })
  refresh_token: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;
}
