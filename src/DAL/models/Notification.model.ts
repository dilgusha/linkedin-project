import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BaseEntity, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "./User.model";

@Entity({ name: "notifications" })
export class Notification extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; 

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @ManyToOne(() => User)
  recipient: User[];
}