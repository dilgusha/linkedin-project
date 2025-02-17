import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "messages" })
export class Message extends CommonEntity {
  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User[];

  @ManyToOne(() => User)
  receiver: User[];
}
