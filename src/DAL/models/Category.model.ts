import { Column, Entity } from "typeorm";
import { CommonEntity } from "./Common.model";

@Entity({ name: "categories" })
export class Category extends CommonEntity {
  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text" })
  description: string;
}
