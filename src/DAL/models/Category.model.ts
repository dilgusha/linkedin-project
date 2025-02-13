import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post.model";


@Entity({ name: "categories" })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text"})
  description: string;

  @CreateDateColumn({ type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ type: "datetime" })
  updated_at: Date;

  @DeleteDateColumn({ type: "datetime" })
  deleted_at: Date;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
