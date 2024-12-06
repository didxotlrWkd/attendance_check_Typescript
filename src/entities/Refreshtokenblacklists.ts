import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("refreshtokenblacklists", { schema: "attendance_app" })
export class Refreshtokenblacklists {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "refresh_token", length: 255 })
  refreshToken: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;
}
