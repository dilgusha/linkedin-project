import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "./Common.model";
import { Experience } from "./Experience.model";

@Entity({ name: "categories" })
export class Category extends CommonEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => Experience, (experience) => experience.categories)
  experience: Experience;
}
