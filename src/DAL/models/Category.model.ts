import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.model";
import { CommonEntity } from "./Common.model";

@Entity({ name: "categories" })
export class Category extends CommonEntity {

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
