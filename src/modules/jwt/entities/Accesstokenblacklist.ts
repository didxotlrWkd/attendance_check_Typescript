import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("accesstokenblacklists", { schema: "attendance_app" })
export class Accesstokenblacklist {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "access_token", length: 255 })
  accessToken: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;
}
