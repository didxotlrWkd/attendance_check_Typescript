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
@Entity("refreshtokens", { schema: "attendance_app" })
export class Refreshtoken {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "refresh_token", length: 255 })
  refresh_token: string;

  @Column("datetime", { name: "createdAt",default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column("int", { name: "user_id", nullable: true }) // user_id 컬럼 추가
  user_id: number; // Users 엔티티의 id와 동일한 타입

  @ManyToOne(() => User, (users) => users.refreshtokens, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
