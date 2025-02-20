import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { CommonEntity } from "./Common.model";
import { Experience } from "./Experience.model";

@Entity({ name: "categories" })
export class Category extends CommonEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @ManyToMany(() => Experience, (experience) => experience.categories)
  experiences: Experience[];
}
