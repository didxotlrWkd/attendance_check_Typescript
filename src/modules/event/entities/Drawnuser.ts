import { User } from "src/modules/user/entities/User";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("user_id", ["user_id"], {})
@Entity("drawnusers", { schema: "attendance_app" })
export class Drawnuser {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "createdAt" })
  createdAt: Date;

  @Column("int", { name: "user_id", nullable: true })
  user_id: number | null;

  @ManyToOne(() => User, (users) => users.drawnusers, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
