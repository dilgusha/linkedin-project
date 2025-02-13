import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User.model";


@Entity({ name: "vacancies" })
export class Vacancy extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  ViewCount: number;
  
  @Column({ type: "text" })
  description: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

    @ManyToOne(() => User, (user) => user.posts)
    user: User[];
}
