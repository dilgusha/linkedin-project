import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "notifications" })
export class Notification extends CommonEntity {
  @Column({ type: "varchar", length: 100, default: null  })
  type: string;

  @Column({ type: "varchar"})
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  recipient: User[];
}
