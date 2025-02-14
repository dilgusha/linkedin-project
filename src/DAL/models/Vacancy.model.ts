import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToMany(() => User, (user) => user.appliedVacancies)
  appliedUsers: User[];
}
