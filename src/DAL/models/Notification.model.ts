import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "notifications" })
export class Notification extends CommonEntity {
  @Column()
  type: string;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  recipient: User[];
}
