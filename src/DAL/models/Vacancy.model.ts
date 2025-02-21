import { Column, Entity, ManyToMany } from "typeorm";
import { User } from "./User.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "vacancies" })
export class Vacancy extends CommonEntity {
  @Column({ type: "int" , default:null})
  viewCount: number;

  @Column({ type: "text" , default:null})
  description: string;

  @Column({ type: "varchar", length: 150, default:null })
  image_url?: string;

  @Column({ type: "int" })
  user_id: number;

  @ManyToMany(() => User, (user) => user.appliedVacancies)
  appliedUsers: User[];
}
