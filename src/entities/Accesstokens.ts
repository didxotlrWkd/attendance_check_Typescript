import { Users } from "src/modules/users/entities/Users";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("user_id", ["userId"], {})
@Entity("accesstokens", { schema: "attendance_app" })
export class Accesstokens {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "access_token", length: 255 })
  accessToken: string;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @ManyToOne(() => Users, (users) => users.accesstokens, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}