import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "vacancies" })
export class Vacancy extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  ViewCount: number;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User[];
}
