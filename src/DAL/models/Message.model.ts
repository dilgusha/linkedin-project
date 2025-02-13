import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User.model";

@Entity({ name: "messages" })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @ManyToOne(() => User)
  sender: User[];

  @ManyToOne(() => User)
  receiver: User[];
}
