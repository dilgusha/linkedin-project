import { Column, Entity, ManyToMany } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "vacancies" })
export class Vacancy extends CommonEntity {
  @Column({ type: "int" })
  viewCount: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", length: 150 })
  image_url?: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToMany(() => User, (user) => user.appliedVacancies)
  appliedUsers: User[];
}
